using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/audit-logs")]
[Authorize]
public class AdminAuditLogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminAuditLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AuditLogDto>>>> GetAuditLogs([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(a => a.Action.ToLower().Contains(s) || a.EntityName.ToLower().Contains(s) || a.Username.ToLower().Contains(s) || (a.Details != null && a.Details.ToLower().Contains(s)));
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderByDescending(a => a.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var dtoList = items.Select(a => new AuditLogDto
        {
            Id = a.Id,
            Username = a.Username,
            Action = a.Action,
            EntityName = a.EntityName,
            EntityId = a.EntityId,
            Details = a.Details,
            IpAddress = a.IpAddress,
            CreatedAt = a.CreatedAt
        }).ToList();

        return Ok(ApiResponse<PagedResult<AuditLogDto>>.Ok(PagedResult<AuditLogDto>.Create(dtoList, query.Page, query.PageSize, total)));
    }
}
