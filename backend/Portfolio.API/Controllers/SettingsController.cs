using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<WebsiteSettingsDto>>> GetSettings()
    {
        var settings = await _context.WebsiteSettings
            .Where(s => s.IsActive)
            .ToDictionaryAsync(s => s.Key, s => s.Value);

        var dto = new WebsiteSettingsDto
        {
            Settings = settings
        };

        if (settings.TryGetValue("TickerTexts", out var tickerJson) && !string.IsNullOrWhiteSpace(tickerJson))
        {
            try
            {
                dto.TickerTexts = JsonSerializer.Deserialize<List<string>>(tickerJson) ?? new();
            }
            catch
            {
                dto.TickerTexts = new();
            }
        }

        return Ok(ApiResponse<WebsiteSettingsDto>.Ok(dto));
    }
}
