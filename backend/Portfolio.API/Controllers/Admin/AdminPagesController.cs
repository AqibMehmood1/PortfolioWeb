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
[Route("api/admin/pages")]
[Authorize]
public class AdminPagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminPagesController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SitePageDto>>>> GetAllPages()
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
                SectionCount = p.Sections.Count(s => s.IsActive),
                Sections = p.Sections
                    .Where(s => s.IsActive)
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

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<SitePageDto>>> GetPageById(int id)
    {
        var page = await _context.SitePages
            .Where(p => p.Id == id && p.IsActive)
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
                SectionCount = p.Sections.Count(s => s.IsActive),
                Sections = p.Sections
                    .Where(s => s.IsActive)
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
            return NotFound(ApiResponse.Fail("Page not found."));
        }

        return Ok(ApiResponse<SitePageDto>.Ok(page));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SitePageDto>>> CreatePage([FromBody] CreateSitePageDto dto)
    {
        var cleanSlug = (dto.Slug ?? string.Empty).Trim().ToLower();
        var exists = await _context.SitePages.AnyAsync(p => p.Slug.ToLower() == cleanSlug);
        if (exists)
        {
            return BadRequest(ApiResponse.Fail($"A page with slug '{dto.Slug}' already exists."));
        }

        var page = new SitePage
        {
            Slug = cleanSlug,
            Title = dto.Title.Trim(),
            NavTitle = string.IsNullOrWhiteSpace(dto.NavTitle) ? dto.Title.Trim() : dto.NavTitle.Trim(),
            IsVisible = dto.IsVisible,
            ShowInNav = dto.ShowInNav,
            ShowInFooter = dto.ShowInFooter,
            IsSystem = false,
            DisplayOrder = dto.DisplayOrder > 0 ? dto.DisplayOrder : (await _context.SitePages.MaxAsync(p => (int?)p.DisplayOrder) ?? 0) + 1,
            MetaTitle = dto.MetaTitle,
            MetaDescription = dto.MetaDescription,
            CreatedAt = DateTime.UtcNow
        };

        await _context.SitePages.AddAsync(page);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("Create", "SitePage", page.Id.ToString(), $"Created page '{page.Title}' ({page.Slug})", null, User.Identity?.Name);

        return CreatedAtAction(nameof(GetPageById), new { id = page.Id }, ApiResponse<SitePageDto>.Ok(new SitePageDto
        {
            Id = page.Id,
            Slug = page.Slug,
            Title = page.Title,
            NavTitle = page.NavTitle,
            IsVisible = page.IsVisible,
            ShowInNav = page.ShowInNav,
            ShowInFooter = page.ShowInFooter,
            IsSystem = page.IsSystem,
            DisplayOrder = page.DisplayOrder,
            MetaTitle = page.MetaTitle,
            MetaDescription = page.MetaDescription,
            SectionCount = 0,
            Sections = new()
        }));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<SitePageDto>>> UpdatePage(int id, [FromBody] UpdateSitePageDto dto)
    {
        var page = await _context.SitePages.Include(p => p.Sections).FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (page == null)
        {
            return NotFound(ApiResponse.Fail("Page not found."));
        }

        var cleanSlug = (dto.Slug ?? string.Empty).Trim().ToLower();
        if (page.IsSystem && cleanSlug != page.Slug)
        {
            return BadRequest(ApiResponse.Fail("System page slug cannot be modified to preserve core site functionality."));
        }

        var slugConflict = await _context.SitePages.AnyAsync(p => p.Id != id && p.Slug.ToLower() == cleanSlug);
        if (slugConflict)
        {
            return BadRequest(ApiResponse.Fail($"Another page with slug '{dto.Slug}' already exists."));
        }

        page.Slug = cleanSlug;
        page.Title = dto.Title.Trim();
        page.NavTitle = string.IsNullOrWhiteSpace(dto.NavTitle) ? dto.Title.Trim() : dto.NavTitle.Trim();
        page.IsVisible = dto.IsVisible;
        page.ShowInNav = dto.ShowInNav;
        page.ShowInFooter = dto.ShowInFooter;
        page.DisplayOrder = dto.DisplayOrder;
        page.MetaTitle = dto.MetaTitle;
        page.MetaDescription = dto.MetaDescription;
        page.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("Update", "SitePage", page.Id.ToString(), $"Updated page '{page.Title}' ({page.Slug})", null, User.Identity?.Name);

        return Ok(ApiResponse<SitePageDto>.Ok(new SitePageDto
        {
            Id = page.Id,
            Slug = page.Slug,
            Title = page.Title,
            NavTitle = page.NavTitle,
            IsVisible = page.IsVisible,
            ShowInNav = page.ShowInNav,
            ShowInFooter = page.ShowInFooter,
            IsSystem = page.IsSystem,
            DisplayOrder = page.DisplayOrder,
            MetaTitle = page.MetaTitle,
            MetaDescription = page.MetaDescription,
            SectionCount = page.Sections.Count(s => s.IsActive),
            Sections = page.Sections.Where(s => s.IsActive).OrderBy(s => s.DisplayOrder).Select(s => new SiteSectionDto
            {
                Id = s.Id,
                PageId = s.PageId,
                PageSlug = page.Slug,
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
        }));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePage(int id)
    {
        var page = await _context.SitePages.FirstOrDefaultAsync(p => p.Id == id);
        if (page == null)
        {
            return NotFound(ApiResponse.Fail("Page not found."));
        }

        if (page.IsSystem)
        {
            return BadRequest(ApiResponse.Fail("System pages cannot be deleted. You can hide them instead by toggling visibility."));
        }

        _context.SitePages.Remove(page);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("Delete", "SitePage", id.ToString(), $"Deleted custom page '{page.Title}'", null, User.Identity?.Name);
        return Ok(ApiResponse<bool>.Ok(true, "Page deleted successfully."));
    }

    [HttpPatch("{id:int}/toggle-visibility")]
    public async Task<ActionResult<ApiResponse<bool>>> TogglePageVisibility(int id)
    {
        var page = await _context.SitePages.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (page == null)
        {
            return NotFound(ApiResponse.Fail("Page not found."));
        }

        page.IsVisible = !page.IsVisible;
        page.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("ToggleVisibility", "SitePage", id.ToString(), $"Toggled visibility for page '{page.Title}' to {page.IsVisible}", null, User.Identity?.Name);
        return Ok(ApiResponse<bool>.Ok(page.IsVisible, $"Page visibility set to {(page.IsVisible ? "Visible" : "Hidden")}."));
    }

    [HttpPatch("{id:int}/toggle-nav")]
    public async Task<ActionResult<ApiResponse<bool>>> TogglePageNav(int id)
    {
        var page = await _context.SitePages.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (page == null)
        {
            return NotFound(ApiResponse.Fail("Page not found."));
        }

        page.ShowInNav = !page.ShowInNav;
        page.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("ToggleNav", "SitePage", id.ToString(), $"Toggled navbar display for page '{page.Title}' to {page.ShowInNav}", null, User.Identity?.Name);
        return Ok(ApiResponse<bool>.Ok(page.ShowInNav, $"Navbar display set to {(page.ShowInNav ? "Shown" : "Hidden")}."));
    }

    // ==========================================
    // SECTION OPERATIONS
    // ==========================================

    [HttpPost("{pageId:int}/sections")]
    public async Task<ActionResult<ApiResponse<SiteSectionDto>>> CreateSection(int pageId, [FromBody] CreateSiteSectionDto dto)
    {
        var page = await _context.SitePages.FirstOrDefaultAsync(p => p.Id == pageId && p.IsActive);
        if (page == null)
        {
            return NotFound(ApiResponse.Fail("Target page not found."));
        }

        var cleanKey = (dto.SectionKey ?? string.Empty).Trim().ToLower().Replace(" ", "-");
        var exists = await _context.SiteSections.AnyAsync(s => s.PageId == pageId && s.SectionKey.ToLower() == cleanKey);
        if (exists)
        {
            return BadRequest(ApiResponse.Fail($"A section with key '{dto.SectionKey}' already exists on this page."));
        }

        var maxOrder = await _context.SiteSections.Where(s => s.PageId == pageId).MaxAsync(s => (int?)s.DisplayOrder) ?? 0;

        var section = new SiteSection
        {
            PageId = pageId,
            SectionKey = cleanKey,
            Title = dto.Title.Trim(),
            Subtitle = dto.Subtitle,
            Description = dto.Description,
            SectionType = string.IsNullOrWhiteSpace(dto.SectionType) ? "custom-html" : dto.SectionType,
            IsVisible = dto.IsVisible,
            IsSystem = false,
            DisplayOrder = dto.DisplayOrder > 0 ? dto.DisplayOrder : maxOrder + 1,
            ContentJson = dto.ContentJson,
            CustomHtml = dto.CustomHtml,
            CreatedAt = DateTime.UtcNow
        };

        await _context.SiteSections.AddAsync(section);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateSection", "SiteSection", section.Id.ToString(), $"Created section '{section.Title}' ({section.SectionKey}) on page '{page.Title}'", null, User.Identity?.Name);

        return Ok(ApiResponse<SiteSectionDto>.Ok(new SiteSectionDto
        {
            Id = section.Id,
            PageId = section.PageId,
            PageSlug = page.Slug,
            SectionKey = section.SectionKey,
            Title = section.Title,
            Subtitle = section.Subtitle,
            Description = section.Description,
            SectionType = section.SectionType,
            IsVisible = section.IsVisible,
            IsSystem = section.IsSystem,
            DisplayOrder = section.DisplayOrder,
            ContentJson = section.ContentJson,
            CustomHtml = section.CustomHtml
        }));
    }

    [HttpPut("sections/{sectionId:int}")]
    public async Task<ActionResult<ApiResponse<SiteSectionDto>>> UpdateSection(int sectionId, [FromBody] UpdateSiteSectionDto dto)
    {
        var section = await _context.SiteSections.Include(s => s.Page).FirstOrDefaultAsync(s => s.Id == sectionId);
        if (section == null)
        {
            return NotFound(ApiResponse.Fail("Section not found."));
        }

        var cleanKey = (dto.SectionKey ?? string.Empty).Trim().ToLower().Replace(" ", "-");
        if (section.IsSystem && cleanKey != section.SectionKey.ToLower())
        {
            return BadRequest(ApiResponse.Fail("Built-in section keys cannot be modified."));
        }

        var keyConflict = await _context.SiteSections.AnyAsync(s => s.PageId == section.PageId && s.Id != sectionId && s.SectionKey.ToLower() == cleanKey);
        if (keyConflict)
        {
            return BadRequest(ApiResponse.Fail($"Another section with key '{dto.SectionKey}' already exists on this page."));
        }

        section.SectionKey = cleanKey;
        section.Title = dto.Title.Trim();
        section.Subtitle = dto.Subtitle;
        section.Description = dto.Description;
        section.SectionType = dto.SectionType;
        section.IsVisible = dto.IsVisible;
        section.DisplayOrder = dto.DisplayOrder;
        section.ContentJson = dto.ContentJson;
        section.CustomHtml = dto.CustomHtml;
        section.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UpdateSection", "SiteSection", section.Id.ToString(), $"Updated section '{section.Title}' on page '{section.Page?.Title}'", null, User.Identity?.Name);

        return Ok(ApiResponse<SiteSectionDto>.Ok(new SiteSectionDto
        {
            Id = section.Id,
            PageId = section.PageId,
            PageSlug = section.Page?.Slug ?? string.Empty,
            SectionKey = section.SectionKey,
            Title = section.Title,
            Subtitle = section.Subtitle,
            Description = section.Description,
            SectionType = section.SectionType,
            IsVisible = section.IsVisible,
            IsSystem = section.IsSystem,
            DisplayOrder = section.DisplayOrder,
            ContentJson = section.ContentJson,
            CustomHtml = section.CustomHtml
        }));
    }

    [HttpDelete("sections/{sectionId:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSection(int sectionId)
    {
        var section = await _context.SiteSections.Include(s => s.Page).FirstOrDefaultAsync(s => s.Id == sectionId);
        if (section == null)
        {
            return NotFound(ApiResponse.Fail("Section not found."));
        }

        if (section.IsSystem)
        {
            return BadRequest(ApiResponse.Fail("Built-in system sections cannot be permanently deleted. You can toggle them to Hidden instead."));
        }

        _context.SiteSections.Remove(section);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteSection", "SiteSection", sectionId.ToString(), $"Deleted custom section '{section.Title}' from page '{section.Page?.Title}'", null, User.Identity?.Name);
        return Ok(ApiResponse<bool>.Ok(true, "Section deleted successfully."));
    }

    [HttpPatch("sections/{sectionId:int}/toggle-visibility")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleSectionVisibility(int sectionId)
    {
        var section = await _context.SiteSections.Include(s => s.Page).FirstOrDefaultAsync(s => s.Id == sectionId);
        if (section == null)
        {
            return NotFound(ApiResponse.Fail("Section not found."));
        }

        section.IsVisible = !section.IsVisible;
        section.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("ToggleSectionVisibility", "SiteSection", sectionId.ToString(), $"Toggled visibility for section '{section.Title}' ({section.SectionKey}) to {section.IsVisible}", null, User.Identity?.Name);
        return Ok(ApiResponse<bool>.Ok(section.IsVisible, $"Section visibility set to {(section.IsVisible ? "Visible" : "Hidden")}."));
    }

    [HttpPost("sections/reorder")]
    public async Task<ActionResult<ApiResponse<bool>>> ReorderSections([FromBody] List<ReorderItemDto> items)
    {
        if (items == null || items.Count == 0)
        {
            return BadRequest(ApiResponse.Fail("No reorder items provided."));
        }

        var ids = items.Select(i => i.Id).ToList();
        var sections = await _context.SiteSections.Where(s => ids.Contains(s.Id)).ToListAsync();

        foreach (var item in items)
        {
            var sec = sections.FirstOrDefault(s => s.Id == item.Id);
            if (sec != null)
            {
                sec.DisplayOrder = item.DisplayOrder;
                sec.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true, "Sections reordered successfully."));
    }
}
