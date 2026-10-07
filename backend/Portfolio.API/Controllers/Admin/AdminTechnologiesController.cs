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
[Route("api/admin/technologies")]
[Authorize]
public class AdminTechnologiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminTechnologiesController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<TechnologyDto>>>> GetTechnologies([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.Technologies.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(t => t.Name.ToLower().Contains(s) || t.CategoryKey.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(query.Filter))
        {
            dbQuery = dbQuery.Where(t => t.CategoryKey == query.Filter);
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderBy(t => t.CategoryKey)
            .ThenBy(t => t.DisplayOrder)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var dtoList = items.Select(t => new TechnologyDto
        {
            Id = t.Id,
            CategoryKey = t.CategoryKey,
            Name = t.Name,
            Icon = t.Icon,
            Color = t.Color,
            DisplayOrder = t.DisplayOrder,
            IsActive = t.IsActive
        }).ToList();

        return Ok(ApiResponse<PagedResult<TechnologyDto>>.Ok(PagedResult<TechnologyDto>.Create(dtoList, query.Page, query.PageSize, total)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TechnologyDto>>> CreateTechnology([FromBody] CreateUpdateTechnologyDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid data."));

        var cat = await _context.TechnologyCategories.FirstOrDefaultAsync(c => c.Key == dto.CategoryKey);

        var entity = new Technology
        {
            CategoryKey = dto.CategoryKey,
            CategoryId = cat?.Id,
            Name = dto.Name.Trim(),
            Icon = dto.Icon.Trim(),
            Color = dto.Color.Trim(),
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Technologies.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateTechnology", "Technology", entity.Id.ToString(), $"Added technology '{entity.Name}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new TechnologyDto
        {
            Id = entity.Id,
            CategoryKey = entity.CategoryKey,
            Name = entity.Name,
            Icon = entity.Icon,
            Color = entity.Color,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<TechnologyDto>.Ok(resultDto, "Technology created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<TechnologyDto>>> UpdateTechnology(int id, [FromBody] CreateUpdateTechnologyDto dto)
    {
        var entity = await _context.Technologies.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Technology not found."));

        var cat = await _context.TechnologyCategories.FirstOrDefaultAsync(c => c.Key == dto.CategoryKey);

        entity.CategoryKey = dto.CategoryKey;
        entity.CategoryId = cat?.Id;
        entity.Name = dto.Name.Trim();
        entity.Icon = dto.Icon.Trim();
        entity.Color = dto.Color.Trim();
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateTechnology", "Technology", id.ToString(), $"Updated technology '{entity.Name}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new TechnologyDto
        {
            Id = entity.Id,
            CategoryKey = entity.CategoryKey,
            Name = entity.Name,
            Icon = entity.Icon,
            Color = entity.Color,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<TechnologyDto>.Ok(resultDto, "Technology updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTechnology(int id)
    {
        var entity = await _context.Technologies.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Technology not found."));

        _context.Technologies.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteTechnology", "Technology", id.ToString(), $"Deleted technology '{entity.Name}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Technology deleted successfully."));
    }

    // Categories Endpoints
    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<TechnologyCategoryDto>>>> GetCategories()
    {
        var categories = await _context.TechnologyCategories
            .Include(c => c.Technologies)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        var dtoList = categories.Select(c => new TechnologyCategoryDto
        {
            Id = c.Id,
            Key = c.Key,
            Label = c.Label,
            DisplayOrder = c.DisplayOrder,
            Technologies = c.Technologies.OrderBy(t => t.DisplayOrder).Select(t => new TechnologyDto
            {
                Id = t.Id,
                CategoryKey = t.CategoryKey,
                Name = t.Name,
                Icon = t.Icon,
                Color = t.Color,
                DisplayOrder = t.DisplayOrder,
                IsActive = t.IsActive
            }).ToList()
        }).ToList();

        return Ok(ApiResponse<List<TechnologyCategoryDto>>.Ok(dtoList));
    }

    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<TechnologyCategoryDto>>> CreateCategory([FromBody] CreateUpdateTechnologyCategoryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid category data."));

        var entity = new TechnologyCategory
        {
            Key = dto.Key.Trim().ToLower(),
            Label = dto.Label.Trim(),
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        await _context.TechnologyCategories.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateCategory", "TechnologyCategory", entity.Id.ToString(), $"Created tech category '{entity.Label}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<TechnologyCategoryDto>.Ok(new TechnologyCategoryDto
        {
            Id = entity.Id,
            Key = entity.Key,
            Label = entity.Label,
            DisplayOrder = entity.DisplayOrder
        }, "Category created successfully."));
    }

    [HttpPut("categories/{id:int}")]
    public async Task<ActionResult<ApiResponse<TechnologyCategoryDto>>> UpdateCategory(int id, [FromBody] CreateUpdateTechnologyCategoryDto dto)
    {
        var entity = await _context.TechnologyCategories.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Category not found."));

        entity.Key = dto.Key.Trim().ToLower();
        entity.Label = dto.Label.Trim();
        entity.DisplayOrder = dto.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UpdateCategory", "TechnologyCategory", id.ToString(), $"Updated tech category '{entity.Label}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<TechnologyCategoryDto>.Ok(new TechnologyCategoryDto
        {
            Id = entity.Id,
            Key = entity.Key,
            Label = entity.Label,
            DisplayOrder = entity.DisplayOrder
        }, "Category updated successfully."));
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(int id)
    {
        var entity = await _context.TechnologyCategories.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Category not found."));

        _context.TechnologyCategories.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteCategory", "TechnologyCategory", id.ToString(), $"Deleted tech category '{entity.Label}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Category deleted successfully."));
    }
}
