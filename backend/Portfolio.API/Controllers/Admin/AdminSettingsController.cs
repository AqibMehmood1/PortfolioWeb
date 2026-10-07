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
[Route("api/admin/settings")]
[Authorize]
public class AdminSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminSettingsController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WebsiteSetting>>>> GetAllSettings()
    {
        var settings = await _context.WebsiteSettings
            .OrderBy(s => s.Group)
            .ThenBy(s => s.Key)
            .ToListAsync();

        return Ok(ApiResponse<List<WebsiteSetting>>.Ok(settings));
    }

    [HttpPut("{key}")]
    public async Task<ActionResult<ApiResponse<WebsiteSetting>>> UpdateSetting(string key, [FromBody] UpdateSettingItemDto dto)
    {
        var setting = await _context.WebsiteSettings.FirstOrDefaultAsync(s => s.Key == key);

        if (setting == null)
        {
            setting = new WebsiteSetting
            {
                Key = key,
                Value = dto.Value,
                Group = dto.Group ?? "General",
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };
            await _context.WebsiteSettings.AddAsync(setting);
        }
        else
        {
            setting.Value = dto.Value;
            if (!string.IsNullOrEmpty(dto.Group)) setting.Group = dto.Group;
            if (dto.Description != null) setting.Description = dto.Description;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateSetting", "WebsiteSetting", key, $"Updated setting {key}", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<WebsiteSetting>.Ok(setting, "Setting updated successfully."));
    }

    [HttpPut("bulk")]
    public async Task<ActionResult<ApiResponse<object>>> BulkUpdateSettings([FromBody] BulkUpdateSettingsDto dto)
    {
        if (dto?.Settings == null || dto.Settings.Count == 0)
        {
            return BadRequest(ApiResponse.Fail("No settings provided."));
        }

        foreach (var item in dto.Settings)
        {
            var existing = await _context.WebsiteSettings.FirstOrDefaultAsync(s => s.Key == item.Key);
            if (existing != null)
            {
                existing.Value = item.Value;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                await _context.WebsiteSettings.AddAsync(new WebsiteSetting
                {
                    Key = item.Key,
                    Value = item.Value,
                    Group = item.Group ?? "General",
                    Description = item.Description,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("BulkUpdateSettings", "WebsiteSetting", null, $"Bulk updated {dto.Settings.Count} settings", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Settings updated successfully."));
    }
}
