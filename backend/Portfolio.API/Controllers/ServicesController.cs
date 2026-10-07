using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServicesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetAllServices()
    {
        var services = await _context.Services
            .Where(s => s.IsActive && s.IsPublished)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        var dtoList = services.Select(s => new ServiceDto
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

        return Ok(ApiResponse<List<ServiceDto>>.Ok(dtoList));
    }

    [HttpGet("accordion")]
    public async Task<ActionResult<ApiResponse<List<AccordionServiceItemDto>>>> GetAccordionServices()
    {
        var items = await _context.AccordionServices
            .Where(a => a.IsActive && a.IsPublished)
            .OrderBy(a => a.DisplayOrder)
            .ToListAsync();

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

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> GetServiceBySlug(string slug)
    {
        var service = await _context.Services
            .FirstOrDefaultAsync(s => s.Slug == slug && s.IsActive && s.IsPublished);

        if (service == null)
        {
            return NotFound(ApiResponse<ServiceDto>.Fail($"Service '{slug}' was not found."));
        }

        var dto = new ServiceDto
        {
            Id = service.Id,
            Slug = service.Slug,
            Icon = service.Icon,
            Title = service.Title,
            ShortDescription = service.ShortDescription,
            FullDescription = service.FullDescription,
            Deliverables = DeserializeList<string>(service.DeliverablesJson),
            EngagementTopic = service.EngagementTopic,
            DisplayOrder = service.DisplayOrder,
            IsPublished = service.IsPublished,
            IsActive = service.IsActive
        };

        return Ok(ApiResponse<ServiceDto>.Ok(dto));
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
