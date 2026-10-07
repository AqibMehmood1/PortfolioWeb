using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize]
public class AdminDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
    {
        var totalProjects = await _context.Projects.CountAsync();
        var publishedProjects = await _context.Projects.CountAsync(p => p.IsPublished && p.IsActive);
        var totalServices = await _context.Services.CountAsync(s => s.IsActive);
        var totalTechnologies = await _context.Technologies.CountAsync(t => t.IsActive);
        var totalTestimonials = await _context.Testimonials.CountAsync(t => t.IsActive);
        var totalInquiries = await _context.ContactInquiries.CountAsync();
        var newInquiries = await _context.ContactInquiries.CountAsync(i => i.Status == "New");
        var totalMediaFiles = await _context.MediaFiles.CountAsync();

        var recentInquiries = await _context.ContactInquiries
            .OrderByDescending(i => i.CreatedAt)
            .Take(5)
            .Select(i => new ContactInquiryDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Phone = i.Phone,
                Company = i.Company,
                Subject = i.Subject,
                TechStack = i.TechStack,
                Message = i.Message,
                Status = i.Status,
                AdminNotes = i.AdminNotes,
                CreatedAt = i.CreatedAt
            })
            .ToListAsync();

        var recentProjectsRaw = await _context.Projects
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .ToListAsync();

        var recentProjects = recentProjectsRaw.Select(p => new ProjectDto
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

        var recentActivities = await _context.AuditLogs
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .Select(a => new AuditLogDto
            {
                Id = a.Id,
                Username = a.Username,
                Action = a.Action,
                EntityName = a.EntityName,
                EntityId = a.EntityId,
                Details = a.Details,
                IpAddress = a.IpAddress,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        var stats = new DashboardStatsDto
        {
            TotalProjects = totalProjects,
            PublishedProjects = publishedProjects,
            TotalServices = totalServices,
            TotalTechnologies = totalTechnologies,
            TotalTestimonials = totalTestimonials,
            TotalInquiries = totalInquiries,
            NewInquiries = newInquiries,
            TotalMediaFiles = totalMediaFiles,
            RecentInquiries = recentInquiries,
            RecentProjects = recentProjects,
            RecentActivities = recentActivities
        };

        return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
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
