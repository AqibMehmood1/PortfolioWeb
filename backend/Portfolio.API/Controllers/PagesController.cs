using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/pages")]
public class PagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SitePageDto>>>> GetPages()
    {
        var pages = await _context.SitePages
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new SitePageDto
            {
                Id = p.Id,
                Slug = p.Slug,
                Title = p.Title,
                NavTitle = string.IsNullOrWhiteSpace(p.NavTitle) ? p.Title : p.NavTitle,
                IsVisible = p.IsVisible,
                ShowInNav = p.ShowInNav,
                ShowInFooter = p.ShowInFooter,
                IsSystem = p.IsSystem,
                DisplayOrder = p.DisplayOrder,
                MetaTitle = p.MetaTitle,
                MetaDescription = p.MetaDescription,
                SectionCount = p.Sections.Count(s => s.IsActive && s.IsVisible),
                Sections = p.Sections
                    .Where(s => s.IsActive && s.IsVisible)
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => new SiteSectionDto
                    {
                        Id = s.Id,
                        PageId = s.PageId,
                        PageSlug = p.Slug,
                        SectionKey = s.SectionKey,
                        Title = s.Title,
                        Subtitle = s.Subtitle,
                        Description = s.Description,
                        SectionType = s.SectionType,
                        IsVisible = s.IsVisible,
                        IsSystem = s.IsSystem,
                        DisplayOrder = s.DisplayOrder,
                        ContentJson = s.ContentJson,
                        CustomHtml = s.CustomHtml
                    }).ToList()
            })
            .ToListAsync();

        return Ok(ApiResponse<List<SitePageDto>>.Ok(pages));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<SitePageDto>>> GetPageBySlug(string slug)
    {
        var cleanSlug = (slug ?? string.Empty).Trim().ToLower();
        if (cleanSlug == "home") cleanSlug = "";

        var page = await _context.SitePages
            .Where(p => p.IsActive && p.Slug.ToLower() == cleanSlug)
            .Select(p => new SitePageDto
            {
                Id = p.Id,
                Slug = p.Slug,
                Title = p.Title,
                NavTitle = string.IsNullOrWhiteSpace(p.NavTitle) ? p.Title : p.NavTitle,
                IsVisible = p.IsVisible,
                ShowInNav = p.ShowInNav,
                ShowInFooter = p.ShowInFooter,
                IsSystem = p.IsSystem,
                DisplayOrder = p.DisplayOrder,
                MetaTitle = p.MetaTitle,
                MetaDescription = p.MetaDescription,
                SectionCount = p.Sections.Count(s => s.IsActive && s.IsVisible),
                Sections = p.Sections
                    .Where(s => s.IsActive && s.IsVisible)
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => new SiteSectionDto
                    {
                        Id = s.Id,
                        PageId = s.PageId,
                        PageSlug = p.Slug,
                        SectionKey = s.SectionKey,
                        Title = s.Title,
                        Subtitle = s.Subtitle,
                        Description = s.Description,
                        SectionType = s.SectionType,
                        IsVisible = s.IsVisible,
                        IsSystem = s.IsSystem,
                        DisplayOrder = s.DisplayOrder,
                        ContentJson = s.ContentJson,
                        CustomHtml = s.CustomHtml
                    }).ToList()
            })
            .FirstOrDefaultAsync();

        if (page == null)
        {
            return NotFound(ApiResponse.Fail($"Page with slug '{slug}' not found."));
        }

        return Ok(ApiResponse<SitePageDto>.Ok(page));
    }
}
