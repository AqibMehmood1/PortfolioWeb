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
[Route("api/admin/projects")]
[Authorize]
public class AdminProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminProjectsController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ProjectDto>>>> GetProjects([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.Projects.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(p => p.Title.ToLower().Contains(s) || p.Category.ToLower().Contains(s) || p.Description.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(query.Filter) && query.Filter != "all")
        {
            dbQuery = dbQuery.Where(p => p.FilterCategory == query.Filter);
        }

        var totalItems = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderBy(p => p.DisplayOrder)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var dtoList = items.Select(p => new ProjectDto
        {
            Id = p.Id,
            Slug = p.Slug,
            Title = p.Title,
            Category = p.Category,
            FilterCategory = p.FilterCategory,
            Image = p.Image,
            Gif = p.Gif,
            Description = p.Description,
            Problem = p.Problem,
            Architecture = p.Architecture,
            Tech = DeserializeList<string>(p.TechnologiesJson),
            Highlights = DeserializeList<string>(p.HighlightsJson),
            LiveUrl = p.LiveUrl,
            DisplayOrder = p.DisplayOrder,
            IsFeatured = p.IsFeatured,
            IsPublished = p.IsPublished,
            IsActive = p.IsActive
        }).ToList();

        return Ok(ApiResponse<PagedResult<ProjectDto>>.Ok(PagedResult<ProjectDto>.Create(dtoList, query.Page, query.PageSize, totalItems)));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> GetProject(int id)
    {
        var p = await _context.Projects.FindAsync(id);
        if (p == null) return NotFound(ApiResponse.Fail("Project not found."));

        var dto = new ProjectDto
        {
            Id = p.Id,
            Slug = p.Slug,
            Title = p.Title,
            Category = p.Category,
            FilterCategory = p.FilterCategory,
            Image = p.Image,
            Gif = p.Gif,
            Description = p.Description,
            Problem = p.Problem,
            Architecture = p.Architecture,
            Tech = DeserializeList<string>(p.TechnologiesJson),
            Highlights = DeserializeList<string>(p.HighlightsJson),
            LiveUrl = p.LiveUrl,
            DisplayOrder = p.DisplayOrder,
            IsFeatured = p.IsFeatured,
            IsPublished = p.IsPublished,
            IsActive = p.IsActive
        };

        return Ok(ApiResponse<ProjectDto>.Ok(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> CreateProject([FromBody] CreateUpdateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid project data."));

        if (await _context.Projects.AnyAsync(p => p.Slug == dto.Slug))
        {
            return BadRequest(ApiResponse.Fail($"A project with slug '{dto.Slug}' already exists."));
        }

        var entity = new Project
        {
            Slug = dto.Slug.Trim(),
            Title = dto.Title.Trim(),
            Category = dto.Category?.Trim() ?? string.Empty,
            FilterCategory = dto.FilterCategory?.Trim() ?? "all",
            Image = dto.Image?.Trim() ?? string.Empty,
            Gif = dto.Gif?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            Problem = dto.Problem?.Trim() ?? string.Empty,
            Architecture = dto.Architecture?.Trim() ?? string.Empty,
            TechnologiesJson = JsonSerializer.Serialize(dto.Technologies ?? new()),
            HighlightsJson = JsonSerializer.Serialize(dto.Highlights ?? new()),
            LiveUrl = dto.LiveUrl?.Trim() ?? string.Empty,
            DisplayOrder = dto.DisplayOrder,
            IsFeatured = dto.IsFeatured,
            IsPublished = dto.IsPublished,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Projects.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateProject", "Project", entity.Id.ToString(), $"Created project '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new ProjectDto
        {
            Id = entity.Id,
            Slug = entity.Slug,
            Title = entity.Title,
            Category = entity.Category,
            FilterCategory = entity.FilterCategory,
            Image = entity.Image,
            Gif = entity.Gif,
            Description = entity.Description,
            Problem = entity.Problem,
            Architecture = entity.Architecture,
            Tech = dto.Technologies ?? new(),
            Highlights = dto.Highlights ?? new(),
            LiveUrl = entity.LiveUrl,
            DisplayOrder = entity.DisplayOrder,
            IsFeatured = entity.IsFeatured,
            IsPublished = entity.IsPublished,
            IsActive = entity.IsActive
        };

        return CreatedAtAction(nameof(GetProject), new { id = entity.Id }, ApiResponse<ProjectDto>.Ok(resultDto, "Project created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> UpdateProject(int id, [FromBody] CreateUpdateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid project data."));

        var entity = await _context.Projects.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Project not found."));

        if (await _context.Projects.AnyAsync(p => p.Slug == dto.Slug && p.Id != id))
        {
            return BadRequest(ApiResponse.Fail($"A project with slug '{dto.Slug}' already exists."));
        }

        entity.Slug = dto.Slug.Trim();
        entity.Title = dto.Title.Trim();
        entity.Category = dto.Category?.Trim() ?? string.Empty;
        entity.FilterCategory = dto.FilterCategory?.Trim() ?? "all";
        entity.Image = dto.Image?.Trim() ?? string.Empty;
        entity.Gif = dto.Gif?.Trim() ?? string.Empty;
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.Problem = dto.Problem?.Trim() ?? string.Empty;
        entity.Architecture = dto.Architecture?.Trim() ?? string.Empty;
        entity.TechnologiesJson = JsonSerializer.Serialize(dto.Technologies ?? new());
        entity.HighlightsJson = JsonSerializer.Serialize(dto.Highlights ?? new());
        entity.LiveUrl = dto.LiveUrl?.Trim() ?? string.Empty;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsFeatured = dto.IsFeatured;
        entity.IsPublished = dto.IsPublished;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateProject", "Project", entity.Id.ToString(), $"Updated project '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new ProjectDto
        {
            Id = entity.Id,
            Slug = entity.Slug,
            Title = entity.Title,
            Category = entity.Category,
            FilterCategory = entity.FilterCategory,
            Image = entity.Image,
            Gif = entity.Gif,
            Description = entity.Description,
            Problem = entity.Problem,
            Architecture = entity.Architecture,
            Tech = dto.Technologies ?? new(),
            Highlights = dto.Highlights ?? new(),
            LiveUrl = entity.LiveUrl,
            DisplayOrder = entity.DisplayOrder,
            IsFeatured = entity.IsFeatured,
            IsPublished = entity.IsPublished,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<ProjectDto>.Ok(resultDto, "Project updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProject(int id)
    {
        var entity = await _context.Projects.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Project not found."));

        _context.Projects.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteProject", "Project", id.ToString(), $"Deleted project '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Project deleted successfully."));
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
