using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<HomePageDto>>> GetHomeContent()
    {
        var hero = await _context.HomePageContents
            .FirstOrDefaultAsync(h => h.SectionKey == "hero" && h.IsActive);

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
            AdditionalData = string.IsNullOrEmpty(hero.AdditionalDataJson) ? null : JsonSerializer.Deserialize<object>(hero.AdditionalDataJson)
        };

        return Ok(ApiResponse<HomePageDto>.Ok(dto));
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
