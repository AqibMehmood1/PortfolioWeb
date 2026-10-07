using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetProjects([FromQuery] string? filter)
    {
        var query = _context.Projects
            .Where(p => p.IsActive && p.IsPublished);

        if (!string.IsNullOrEmpty(filter) && filter != "all")
        {
            query = query.Where(p => p.FilterCategory == filter);
        }

        var projects = await query.OrderBy(p => p.DisplayOrder).ToListAsync();

        var dtoList = projects.Select(p => new ProjectDto
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

        return Ok(ApiResponse<List<ProjectDto>>.Ok(dtoList));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetFeaturedProjects()
    {
        var projects = await _context.Projects
            .Where(p => p.IsActive && p.IsPublished && p.IsFeatured)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        var dtoList = projects.Select(p => new ProjectDto
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

        return Ok(ApiResponse<List<ProjectDto>>.Ok(dtoList));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> GetProjectBySlug(string slug)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive && p.IsPublished);

        if (project == null)
        {
            return NotFound(ApiResponse<ProjectDto>.Fail($"Project '{slug}' was not found."));
        }

        var dto = new ProjectDto
        {
            Id = project.Id,
            Slug = project.Slug,
            Title = project.Title,
            Category = project.Category,
            FilterCategory = project.FilterCategory,
            Image = project.Image,
            Gif = project.Gif,
            Description = project.Description,
            Problem = project.Problem,
            Architecture = project.Architecture,
            Tech = DeserializeList<string>(project.TechnologiesJson),
            Highlights = DeserializeList<string>(project.HighlightsJson),
            LiveUrl = project.LiveUrl,
            DisplayOrder = project.DisplayOrder,
            IsFeatured = project.IsFeatured,
            IsPublished = project.IsPublished,
            IsActive = project.IsActive
        };

        return Ok(ApiResponse<ProjectDto>.Ok(dto));
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
