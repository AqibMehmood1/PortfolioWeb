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
[Route("api/admin/about")]
[Authorize]
public class AdminAboutController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminAboutController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<AboutPageDto>>> GetAboutContent()
    {
        var about = await _context.AboutContents.FirstOrDefaultAsync(a => a.SectionKey == "about-main");
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

    [HttpPut]
    public async Task<ActionResult<ApiResponse<AboutPageDto>>> UpdateAboutContent([FromBody] UpdateAboutPageDto dto)
    {
        var about = await _context.AboutContents.FirstOrDefaultAsync(a => a.SectionKey == "about-main");
        if (about == null)
        {
            about = new AboutContent { SectionKey = "about-main", CreatedAt = DateTime.UtcNow };
            await _context.AboutContents.AddAsync(about);
        }

        about.Headline = dto.Headline;
        about.Subtitle = dto.Subtitle;
        about.VisionHeadline = dto.VisionHeadline;
        about.VisionLead = dto.VisionLead;
        about.VisionDescription = dto.VisionDescription;
        about.FocusAreasJson = JsonSerializer.Serialize(dto.FocusAreas);
        about.ExecutionStepsJson = JsonSerializer.Serialize(dto.ExecutionSteps);
        about.ValueCardsJson = JsonSerializer.Serialize(dto.ValueCards);
        about.ThreeStepProcessJson = JsonSerializer.Serialize(dto.ThreeStepProcess);
        about.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateAboutContent", "AboutContent", about.Id.ToString(), "Updated about page content", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new AboutPageDto
        {
            Headline = about.Headline,
            Subtitle = about.Subtitle,
            VisionHeadline = about.VisionHeadline,
            VisionLead = about.VisionLead,
            VisionDescription = about.VisionDescription,
            FocusAreas = dto.FocusAreas,
            ExecutionSteps = dto.ExecutionSteps,
            ValueCards = dto.ValueCards,
            ThreeStepProcess = dto.ThreeStepProcess
        };

        return Ok(ApiResponse<AboutPageDto>.Ok(resultDto, "About page content updated successfully."));
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
