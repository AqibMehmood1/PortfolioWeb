using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AboutController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<AboutPageDto>>> GetAboutContent()
    {
        var about = await _context.AboutContents
            .FirstOrDefaultAsync(a => a.SectionKey == "about-main" && a.IsActive);

        if (about == null)
        {
            return Ok(ApiResponse<AboutPageDto>.Ok(new AboutPageDto()));
        }

        var dto = new AboutPageDto
        {
            Headline = about.Headline,
            Subtitle = about.Subtitle,
            VisionHeadline = about.VisionHeadline,
            VisionLead = about.VisionLead,
            VisionDescription = about.VisionDescription,
            FocusAreas = DeserializeList<string>(about.FocusAreasJson),
            ExecutionSteps = DeserializeList<StepItemDto>(about.ExecutionStepsJson),
            ValueCards = DeserializeList<ValueCardDto>(about.ValueCardsJson),
            ThreeStepProcess = DeserializeList<StepItemDto>(about.ThreeStepProcessJson)
        };

        return Ok(ApiResponse<AboutPageDto>.Ok(dto));
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
