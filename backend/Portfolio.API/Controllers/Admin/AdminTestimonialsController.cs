using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/testimonials")]
[Authorize]
public class AdminTestimonialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminTestimonialsController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TestimonialDto>>>> GetTestimonials()
    {
        var list = await _context.Testimonials.OrderBy(t => t.DisplayOrder).ToListAsync();
        var dtoList = list.Select(t => new TestimonialDto
        {
            Id = t.Id,
            Quote = t.Quote,
            Author = t.Author,
            Role = t.Role,
            Tag = t.Tag,
            Rating = t.Rating,
            DisplayOrder = t.DisplayOrder,
            IsPublished = t.IsPublished
        }).ToList();

        return Ok(ApiResponse<List<TestimonialDto>>.Ok(dtoList));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> CreateTestimonial([FromBody] CreateUpdateTestimonialDto dto)
    {
        var entity = new Testimonial
        {
            Quote = dto.Quote.Trim(),
            Author = dto.Author.Trim(),
            Role = dto.Role?.Trim() ?? string.Empty,
            Tag = dto.Tag?.Trim() ?? string.Empty,
            Rating = dto.Rating,
            DisplayOrder = dto.DisplayOrder,
            IsPublished = dto.IsPublished,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Testimonials.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateTestimonial", "Testimonial", entity.Id.ToString(), $"Added testimonial from '{entity.Author}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<TestimonialDto>.Ok(new TestimonialDto
        {
            Id = entity.Id,
            Quote = entity.Quote,
            Author = entity.Author,
            Role = entity.Role,
            Tag = entity.Tag,
            Rating = entity.Rating,
            DisplayOrder = entity.DisplayOrder,
            IsPublished = entity.IsPublished
        }, "Testimonial created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> UpdateTestimonial(int id, [FromBody] CreateUpdateTestimonialDto dto)
    {
        var entity = await _context.Testimonials.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Testimonial not found."));

        entity.Quote = dto.Quote.Trim();
        entity.Author = dto.Author.Trim();
        entity.Role = dto.Role?.Trim() ?? string.Empty;
        entity.Tag = dto.Tag?.Trim() ?? string.Empty;
        entity.Rating = dto.Rating;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateTestimonial", "Testimonial", id.ToString(), $"Updated testimonial from '{entity.Author}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<TestimonialDto>.Ok(new TestimonialDto
        {
            Id = entity.Id,
            Quote = entity.Quote,
            Author = entity.Author,
            Role = entity.Role,
            Tag = entity.Tag,
            Rating = entity.Rating,
            DisplayOrder = entity.DisplayOrder,
            IsPublished = entity.IsPublished
        }, "Testimonial updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTestimonial(int id)
    {
        var entity = await _context.Testimonials.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Testimonial not found."));

        _context.Testimonials.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteTestimonial", "Testimonial", id.ToString(), $"Deleted testimonial from '{entity.Author}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Testimonial deleted successfully."));
    }

    // Industries
    [HttpGet("industries")]
    public async Task<ActionResult<ApiResponse<List<IndustryDto>>>> GetIndustries()
    {
        var list = await _context.Industries.OrderBy(i => i.DisplayOrder).ToListAsync();
        var dtoList = list.Select(i => new IndustryDto
        {
            Id = i.Id,
            Title = i.Title,
            Icon = i.Icon,
            Description = i.Description,
            Project = i.Project,
            Metric = i.Metric,
            DisplayOrder = i.DisplayOrder,
            IsActive = i.IsActive
        }).ToList();

        return Ok(ApiResponse<List<IndustryDto>>.Ok(dtoList));
    }

    [HttpPost("industries")]
    public async Task<ActionResult<ApiResponse<IndustryDto>>> CreateIndustry([FromBody] CreateUpdateIndustryDto dto)
    {
        var entity = new Industry
        {
            Title = dto.Title.Trim(),
            Icon = dto.Icon.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Project = dto.Project?.Trim() ?? string.Empty,
            Metric = dto.Metric?.Trim() ?? string.Empty,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Industries.AddAsync(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<IndustryDto>.Ok(new IndustryDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Icon = entity.Icon,
            Description = entity.Description,
            Project = entity.Project,
            Metric = entity.Metric,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Industry created successfully."));
    }

    [HttpPut("industries/{id:int}")]
    public async Task<ActionResult<ApiResponse<IndustryDto>>> UpdateIndustry(int id, [FromBody] CreateUpdateIndustryDto dto)
    {
        var entity = await _context.Industries.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Industry not found."));

        entity.Title = dto.Title.Trim();
        entity.Icon = dto.Icon.Trim();
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.Project = dto.Project?.Trim() ?? string.Empty;
        entity.Metric = dto.Metric?.Trim() ?? string.Empty;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<IndustryDto>.Ok(new IndustryDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Icon = entity.Icon,
            Description = entity.Description,
            Project = entity.Project,
            Metric = entity.Metric,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Industry updated successfully."));
    }

    [HttpDelete("industries/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteIndustry(int id)
    {
        var entity = await _context.Industries.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Industry not found."));

        _context.Industries.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(null, "Industry deleted successfully."));
    }
}
