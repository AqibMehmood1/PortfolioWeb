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
[Route("api/admin/seo")]
[Authorize]
public class AdminSeoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminSeoController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SeoMetadataDto>>>> GetAllSeo()
    {
        var list = await _context.SeoMetadata.ToListAsync();
        var dtoList = list.Select(s => new SeoMetadataDto
        {
            Id = s.Id,
            PageRoute = s.PageRoute,
            Title = s.Title,
            Description = s.Description,
            Keywords = s.Keywords,
            CanonicalUrl = s.CanonicalUrl,
            OgTitle = s.OgTitle,
            OgDescription = s.OgDescription,
            OgImage = s.OgImage,
            Robots = s.Robots
        }).ToList();

        return Ok(ApiResponse<List<SeoMetadataDto>>.Ok(dtoList));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SeoMetadataDto>>> CreateSeo([FromBody] CreateUpdateSeoMetadataDto dto)
    {
        var normalizedRoute = dto.PageRoute.Trim();
        if (!normalizedRoute.StartsWith('/')) normalizedRoute = "/" + normalizedRoute;

        if (await _context.SeoMetadata.AnyAsync(s => s.PageRoute == normalizedRoute))
        {
            return BadRequest(ApiResponse.Fail($"SEO metadata for route '{normalizedRoute}' already exists."));
        }

        var entity = new SeoMetadata
        {
            PageRoute = normalizedRoute,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Keywords = dto.Keywords?.Trim() ?? string.Empty,
            CanonicalUrl = dto.CanonicalUrl?.Trim(),
            OgTitle = dto.OgTitle?.Trim(),
            OgDescription = dto.OgDescription?.Trim(),
            OgImage = dto.OgImage?.Trim(),
            Robots = dto.Robots ?? "index, follow",
            CreatedAt = DateTime.UtcNow
        };

        await _context.SeoMetadata.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateSeo", "SeoMetadata", entity.Id.ToString(), $"Added SEO for '{normalizedRoute}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<SeoMetadataDto>.Ok(new SeoMetadataDto
        {
            Id = entity.Id,
            PageRoute = entity.PageRoute,
            Title = entity.Title,
            Description = entity.Description,
            Keywords = entity.Keywords,
            CanonicalUrl = entity.CanonicalUrl,
            OgTitle = entity.OgTitle,
            OgDescription = entity.OgDescription,
            OgImage = entity.OgImage,
            Robots = entity.Robots
        }, "SEO metadata created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<SeoMetadataDto>>> UpdateSeo(int id, [FromBody] CreateUpdateSeoMetadataDto dto)
    {
        var entity = await _context.SeoMetadata.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("SEO metadata not found."));

        var normalizedRoute = dto.PageRoute.Trim();
        if (!normalizedRoute.StartsWith('/')) normalizedRoute = "/" + normalizedRoute;

        if (await _context.SeoMetadata.AnyAsync(s => s.PageRoute == normalizedRoute && s.Id != id))
        {
            return BadRequest(ApiResponse.Fail($"SEO metadata for route '{normalizedRoute}' already exists."));
        }

        entity.PageRoute = normalizedRoute;
        entity.Title = dto.Title.Trim();
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.Keywords = dto.Keywords?.Trim() ?? string.Empty;
        entity.CanonicalUrl = dto.CanonicalUrl?.Trim();
        entity.OgTitle = dto.OgTitle?.Trim();
        entity.OgDescription = dto.OgDescription?.Trim();
        entity.OgImage = dto.OgImage?.Trim();
        entity.Robots = dto.Robots ?? "index, follow";
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateSeo", "SeoMetadata", id.ToString(), $"Updated SEO for '{normalizedRoute}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<SeoMetadataDto>.Ok(new SeoMetadataDto
        {
            Id = entity.Id,
            PageRoute = entity.PageRoute,
            Title = entity.Title,
            Description = entity.Description,
            Keywords = entity.Keywords,
            CanonicalUrl = entity.CanonicalUrl,
            OgTitle = entity.OgTitle,
            OgDescription = entity.OgDescription,
            OgImage = entity.OgImage,
            Robots = entity.Robots
        }, "SEO metadata updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSeo(int id)
    {
        var entity = await _context.SeoMetadata.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("SEO metadata not found."));

        _context.SeoMetadata.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteSeo", "SeoMetadata", id.ToString(), $"Deleted SEO for '{entity.PageRoute}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "SEO metadata deleted successfully."));
    }
}
