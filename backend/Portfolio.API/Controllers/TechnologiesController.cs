using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TechnologiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TechnologiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<Dictionary<string, List<TechnologyDto>>>>> GetTechnologiesGrouped()
    {
        var technologies = await _context.Technologies
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        var grouped = technologies
            .GroupBy(t => t.CategoryKey)
            .ToDictionary(
                g => g.Key,
                g => g.Select(t => new TechnologyDto
                {
                    Id = t.Id,
                    CategoryKey = t.CategoryKey,
                    Name = t.Name,
                    Icon = t.Icon,
                    Color = t.Color,
                    DisplayOrder = t.DisplayOrder,
                    IsActive = t.IsActive
                }).ToList()
            );

        return Ok(ApiResponse<Dictionary<string, List<TechnologyDto>>>.Ok(grouped));
    }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<TechnologyCategoryDto>>>> GetCategories()
    {
        var categories = await _context.TechnologyCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Include(c => c.Technologies.Where(t => t.IsActive))
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
}
