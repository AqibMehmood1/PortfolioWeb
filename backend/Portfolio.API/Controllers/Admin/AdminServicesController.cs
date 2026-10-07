using System.Text.Json;
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
[Route("api/admin/services")]
[Authorize]
public class AdminServicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminServicesController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ServiceDto>>>> GetServices([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.Services.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(x => x.Title.ToLower().Contains(s) || x.ShortDescription.ToLower().Contains(s));
        }

        var totalItems = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderBy(s => s.DisplayOrder)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var dtoList = items.Select(s => new ServiceDto
        {
            Id = s.Id,
            Slug = s.Slug,
            Icon = s.Icon,
            Title = s.Title,
            ShortDescription = s.ShortDescription,
            FullDescription = s.FullDescription,
            Deliverables = DeserializeList<string>(s.DeliverablesJson),
            EngagementTopic = s.EngagementTopic,
            DisplayOrder = s.DisplayOrder,
            IsPublished = s.IsPublished,
            IsActive = s.IsActive
        }).ToList();

        return Ok(ApiResponse<PagedResult<ServiceDto>>.Ok(PagedResult<ServiceDto>.Create(dtoList, query.Page, query.PageSize, totalItems)));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> GetService(int id)
    {
        var s = await _context.Services.FindAsync(id);
        if (s == null) return NotFound(ApiResponse.Fail("Service not found."));

        var dto = new ServiceDto
        {
            Id = s.Id,
            Slug = s.Slug,
            Icon = s.Icon,
            Title = s.Title,
            ShortDescription = s.ShortDescription,
            FullDescription = s.FullDescription,
            Deliverables = DeserializeList<string>(s.DeliverablesJson),
            EngagementTopic = s.EngagementTopic,
            DisplayOrder = s.DisplayOrder,
            IsPublished = s.IsPublished,
            IsActive = s.IsActive
        };

        return Ok(ApiResponse<ServiceDto>.Ok(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> CreateService([FromBody] CreateUpdateServiceDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid service data."));

        if (await _context.Services.AnyAsync(s => s.Slug == dto.Slug))
        {
            return BadRequest(ApiResponse.Fail($"A service with slug '{dto.Slug}' already exists."));
        }

        var entity = new Service
        {
            Slug = dto.Slug.Trim(),
            Icon = dto.Icon.Trim(),
            Title = dto.Title.Trim(),
            ShortDescription = dto.ShortDescription?.Trim() ?? string.Empty,
            FullDescription = dto.FullDescription?.Trim() ?? string.Empty,
            DeliverablesJson = JsonSerializer.Serialize(dto.Deliverables ?? new()),
            EngagementTopic = dto.EngagementTopic?.Trim() ?? string.Empty,
            DisplayOrder = dto.DisplayOrder,
            IsPublished = dto.IsPublished,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Services.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateService", "Service", entity.Id.ToString(), $"Created service '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new ServiceDto
        {
            Id = entity.Id,
            Slug = entity.Slug,
            Icon = entity.Icon,
            Title = entity.Title,
            ShortDescription = entity.ShortDescription,
            FullDescription = entity.FullDescription,
            Deliverables = dto.Deliverables ?? new(),
            EngagementTopic = entity.EngagementTopic,
            DisplayOrder = entity.DisplayOrder,
            IsPublished = entity.IsPublished,
            IsActive = entity.IsActive
        };

        return CreatedAtAction(nameof(GetService), new { id = entity.Id }, ApiResponse<ServiceDto>.Ok(resultDto, "Service created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> UpdateService(int id, [FromBody] CreateUpdateServiceDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid service data."));

        var entity = await _context.Services.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Service not found."));

        if (await _context.Services.AnyAsync(s => s.Slug == dto.Slug && s.Id != id))
        {
            return BadRequest(ApiResponse.Fail($"A service with slug '{dto.Slug}' already exists."));
        }

        entity.Slug = dto.Slug.Trim();
        entity.Icon = dto.Icon.Trim();
        entity.Title = dto.Title.Trim();
        entity.ShortDescription = dto.ShortDescription?.Trim() ?? string.Empty;
        entity.FullDescription = dto.FullDescription?.Trim() ?? string.Empty;
        entity.DeliverablesJson = JsonSerializer.Serialize(dto.Deliverables ?? new());
        entity.EngagementTopic = dto.EngagementTopic?.Trim() ?? string.Empty;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsPublished = dto.IsPublished;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateService", "Service", entity.Id.ToString(), $"Updated service '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new ServiceDto
        {
            Id = entity.Id,
            Slug = entity.Slug,
            Icon = entity.Icon,
            Title = entity.Title,
            ShortDescription = entity.ShortDescription,
            FullDescription = entity.FullDescription,
            Deliverables = dto.Deliverables ?? new(),
            EngagementTopic = entity.EngagementTopic,
            DisplayOrder = entity.DisplayOrder,
            IsPublished = entity.IsPublished,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<ServiceDto>.Ok(resultDto, "Service updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteService(int id)
    {
        var entity = await _context.Services.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Service not found."));

        _context.Services.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteService", "Service", id.ToString(), $"Deleted service '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Service deleted successfully."));
    }

    // Accordion Services
    [HttpGet("accordion")]
    public async Task<ActionResult<ApiResponse<List<AccordionServiceItemDto>>>> GetAccordionServices()
    {
        var items = await _context.AccordionServices.OrderBy(a => a.DisplayOrder).ToListAsync();
        var dtoList = items.Select(a => new AccordionServiceItemDto
        {
            Id = a.Id,
            IndexTag = a.IndexTag,
            Title = a.Title,
            ShortDesc = a.ShortDesc,
            Bullets = DeserializeList<string>(a.BulletsJson),
            Image = a.Image,
            Route = a.Route,
            DisplayOrder = a.DisplayOrder,
            IsPublished = a.IsPublished
        }).ToList();

        return Ok(ApiResponse<List<AccordionServiceItemDto>>.Ok(dtoList));
    }

    [HttpPut("accordion/{id:int}")]
    public async Task<ActionResult<ApiResponse<AccordionServiceItemDto>>> UpdateAccordionService(int id, [FromBody] CreateUpdateAccordionServiceItemDto dto)
    {
        var entity = await _context.AccordionServices.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Accordion item not found."));

        entity.IndexTag = dto.IndexTag;
        entity.Title = dto.Title;
        entity.ShortDesc = dto.ShortDesc;
        entity.BulletsJson = JsonSerializer.Serialize(dto.Bullets ?? new());
        entity.Image = dto.Image;
        entity.Route = dto.Route;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateAccordionService", "AccordionService", id.ToString(), $"Updated accordion item '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<AccordionServiceItemDto>.Ok(new AccordionServiceItemDto
        {
            Id = entity.Id,
            IndexTag = entity.IndexTag,
            Title = entity.Title,
            ShortDesc = entity.ShortDesc,
            Bullets = dto.Bullets ?? new(),
            Image = entity.Image,
            Route = entity.Route,
            DisplayOrder = entity.DisplayOrder,
            IsPublished = entity.IsPublished
        }, "Accordion service updated successfully."));
    }

    private static List<T> DeserializeList<T>(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            return JsonSerializer.Deserialize<List<T>>(json) ?? new();
        }
        catch
        {
            return new();
        }
    }
}
