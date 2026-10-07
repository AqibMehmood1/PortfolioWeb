using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TestimonialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TestimonialDto>>>> GetTestimonials()
    {
        var testimonials = await _context.Testimonials
            .Where(t => t.IsActive && t.IsPublished)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        var dtoList = testimonials.Select(t => new TestimonialDto
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

    [HttpGet("industries")]
    [HttpGet("/api/industries")]
    public async Task<ActionResult<ApiResponse<List<IndustryDto>>>> GetIndustries()
    {
        var industries = await _context.Industries
            .Where(i => i.IsActive)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync();

        var dtoList = industries.Select(i => new IndustryDto
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
}
