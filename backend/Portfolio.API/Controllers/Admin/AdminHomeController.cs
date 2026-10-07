using System.Text.Json;
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
[Route("api/admin/home")]
[Authorize]
public class AdminHomeController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminHomeController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<HomePageDto>>> GetHomeContent()
    {
        var hero = await _context.HomePageContents.FirstOrDefaultAsync(h => h.SectionKey == "hero");
        if (hero == null)
        {
            return Ok(ApiResponse<HomePageDto>.Ok(new HomePageDto()));
        }

        var dto = new HomePageDto
        {
            Headline = hero.Headline,
            Subtitle = hero.Subtitle,
            TypedStrings = DeserializeList<string>(hero.TypedStringsJson),
            Stats = DeserializeList<StatItemDto>(hero.StatsJson),
            AdditionalData = string.IsNullOrEmpty(hero.AdditionalDataJson) ? null : JsonSerializer.Deserialize<object>(hero.AdditionalDataJson, _jsonOptions)
        };

        return Ok(ApiResponse<HomePageDto>.Ok(dto));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<HomePageDto>>> UpdateHomeContent([FromBody] UpdateHomePageDto dto)
    {
        var hero = await _context.HomePageContents.FirstOrDefaultAsync(h => h.SectionKey == "hero");
        if (hero == null)
        {
            hero = new HomePageContent { SectionKey = "hero", CreatedAt = DateTime.UtcNow };
            await _context.HomePageContents.AddAsync(hero);
        }

        hero.Headline = dto.Headline;
        hero.Subtitle = dto.Subtitle;
        hero.TypedStringsJson = JsonSerializer.Serialize(dto.TypedStrings);
        hero.StatsJson = JsonSerializer.Serialize(dto.Stats);
        if (!string.IsNullOrEmpty(dto.AdditionalDataJson))
        {
            hero.AdditionalDataJson = dto.AdditionalDataJson;
        }
        hero.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateHomeContent", "HomePageContent", hero.Id.ToString(), "Updated home page hero content", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<HomePageDto>.Ok(new HomePageDto
        {
            Headline = hero.Headline,
            Subtitle = hero.Subtitle,
            TypedStrings = dto.TypedStrings,
            Stats = dto.Stats
        }, "Home page content updated successfully."));
    }

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static List<T> DeserializeList<T>(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            return JsonSerializer.Deserialize<List<T>>(json, _jsonOptions) ?? new();
        }
        catch
        {
            return new();
        }
    }
}
