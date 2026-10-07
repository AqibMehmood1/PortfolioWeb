using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SeoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SeoMetadataDto>>>> GetAllSeo()
    {
        var list = await _context.SeoMetadata
            .Where(s => s.IsActive)
            .ToListAsync();

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

    [HttpGet("by-route")]
    public async Task<ActionResult<ApiResponse<SeoMetadataDto>>> GetSeoByRoute([FromQuery] string route)
    {
        var normalizedRoute = string.IsNullOrWhiteSpace(route) ? "/" : route.Trim();
        if (!normalizedRoute.StartsWith('/')) normalizedRoute = "/" + normalizedRoute;

        var seo = await _context.SeoMetadata
            .FirstOrDefaultAsync(s => s.PageRoute == normalizedRoute && s.IsActive);

        if (seo == null)
        {
            return Ok(ApiResponse<SeoMetadataDto>.Ok(new SeoMetadataDto
            {
                PageRoute = normalizedRoute,
                Title = "NEXVOYS | Enterprise Technology Partner",
                Description = "Enterprise Solutions Architecture, Multi-Tenant SaaS, Autonomous AI Agents, and Distributed Cloud Systems.",
                Robots = "index, follow"
            }));
        }

        var dto = new SeoMetadataDto
        {
            Id = seo.Id,
            PageRoute = seo.PageRoute,
            Title = seo.Title,
            Description = seo.Description,
            Keywords = seo.Keywords,
            CanonicalUrl = seo.CanonicalUrl,
            OgTitle = seo.OgTitle,
            OgDescription = seo.OgDescription,
            OgImage = seo.OgImage,
            Robots = seo.Robots
        };

        return Ok(ApiResponse<SeoMetadataDto>.Ok(dto));
    }
}
