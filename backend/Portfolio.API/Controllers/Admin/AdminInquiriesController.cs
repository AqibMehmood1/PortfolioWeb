using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/inquiries")]
[Authorize]
public class AdminInquiriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminInquiriesController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ContactInquiryDto>>>> GetInquiries([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.ContactInquiries.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(i => i.Name.ToLower().Contains(s) || i.Email.ToLower().Contains(s) || i.Subject.ToLower().Contains(s) || i.Message.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(query.Filter))
        {
            dbQuery = dbQuery.Where(i => i.Status == query.Filter);
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderByDescending(i => i.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var dtoList = items.Select(i => new ContactInquiryDto
        {
            Id = i.Id,
            Name = i.Name,
            Email = i.Email,
            Phone = i.Phone,
            Company = i.Company,
            Subject = i.Subject,
            TechStack = i.TechStack,
            Message = i.Message,
            Status = i.Status,
            AdminNotes = i.AdminNotes,
            CreatedAt = i.CreatedAt
        }).ToList();

        return Ok(ApiResponse<PagedResult<ContactInquiryDto>>.Ok(PagedResult<ContactInquiryDto>.Create(dtoList, query.Page, query.PageSize, total)));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ContactInquiryDto>>> GetInquiry(int id)
    {
        var i = await _context.ContactInquiries.FindAsync(id);
        if (i == null) return NotFound(ApiResponse.Fail("Inquiry not found."));

        if (i.Status == "New")
        {
            i.Status = "Read";
            await _context.SaveChangesAsync();
        }

        var dto = new ContactInquiryDto
        {
            Id = i.Id,
            Name = i.Name,
            Email = i.Email,
            Phone = i.Phone,
            Company = i.Company,
            Subject = i.Subject,
            TechStack = i.TechStack,
            Message = i.Message,
            Status = i.Status,
            AdminNotes = i.AdminNotes,
            CreatedAt = i.CreatedAt
        };

        return Ok(ApiResponse<ContactInquiryDto>.Ok(dto));
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateStatus(int id, [FromBody] UpdateInquiryStatusDto dto)
    {
        var i = await _context.ContactInquiries.FindAsync(id);
        if (i == null) return NotFound(ApiResponse.Fail("Inquiry not found."));

        var oldStatus = i.Status;
        i.Status = dto.Status;
        if (dto.AdminNotes != null) i.AdminNotes = dto.AdminNotes;
        i.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateInquiryStatus", "ContactInquiry", id.ToString(), $"Changed inquiry status from '{oldStatus}' to '{dto.Status}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Inquiry status updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteInquiry(int id)
    {
        var i = await _context.ContactInquiries.FindAsync(id);
        if (i == null) return NotFound(ApiResponse.Fail("Inquiry not found."));

        _context.ContactInquiries.Remove(i);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteInquiry", "ContactInquiry", id.ToString(), $"Deleted inquiry from {i.Email}", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Inquiry deleted successfully."));
    }
}
