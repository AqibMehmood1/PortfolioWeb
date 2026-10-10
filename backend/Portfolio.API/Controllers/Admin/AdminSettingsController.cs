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

    [HttpPost("batch")]
    [HttpPut("batch")]
    [HttpPost("bulk")]
    [HttpPut("bulk")]
    public async Task<ActionResult<ApiResponse<object>>> BatchUpdateSettings([FromBody] JsonElement body)
    {
        var itemsToUpdate = new List<UpdateSettingItemDto>();

        if (body.ValueKind == JsonValueKind.Array)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var list = JsonSerializer.Deserialize<List<UpdateSettingItemDto>>(body.GetRawText(), options);
            if (list != null) itemsToUpdate.AddRange(list);
        }
        else if (body.ValueKind == JsonValueKind.Object)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            if (body.TryGetProperty("settings", out var settingsProp) || body.TryGetProperty("Settings", out settingsProp))
            {
                if (settingsProp.ValueKind == JsonValueKind.Array)
                {
                    var list = JsonSerializer.Deserialize<List<UpdateSettingItemDto>>(settingsProp.GetRawText(), options);
                    if (list != null) itemsToUpdate.AddRange(list);
                }
            }
            else
            {
                foreach (var prop in body.EnumerateObject())
                {
                    itemsToUpdate.Add(new UpdateSettingItemDto
                    {
                        Key = prop.Name,
                        Value = prop.Value.GetString() ?? prop.Value.GetRawText()
                    });
                }
            }
        }

        if (itemsToUpdate.Count == 0)
        {
            return BadRequest(ApiResponse.Fail("No settings provided to update."));
        }

        foreach (var item in itemsToUpdate)
        {
            if (string.IsNullOrWhiteSpace(item.Key)) continue;

            var existing = await _context.WebsiteSettings.FirstOrDefaultAsync(s => s.Key.ToLower() == item.Key.ToLower());
            if (existing != null)
            {
                existing.Value = item.Value ?? string.Empty;
                if (!string.IsNullOrEmpty(item.Group)) existing.Group = item.Group;
                if (!string.IsNullOrEmpty(item.Description)) existing.Description = item.Description;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                await _context.WebsiteSettings.AddAsync(new WebsiteSetting
                {
                    Key = item.Key,
                    Value = item.Value ?? string.Empty,
                    Group = item.Group ?? "General",
                    Description = item.Description ?? string.Empty,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("BatchUpdateSettings", "WebsiteSetting", null, $"Batch updated {itemsToUpdate.Count} settings", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Settings updated successfully."));
    }
}
