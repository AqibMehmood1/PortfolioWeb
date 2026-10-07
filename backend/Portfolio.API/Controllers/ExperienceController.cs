using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperienceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExperienceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ExperienceDto>>>> GetExperiences()
    {
        var experiences = await _context.Experiences
            .Where(e => e.IsActive)
            .OrderBy(e => e.DisplayOrder)
            .ToListAsync();

        var dtoList = experiences.Select(e => new ExperienceDto
        {
            Id = e.Id,
            Title = e.Title,
            Period = e.Period,
            Company = e.Company,
            Location = e.Location,
            Description = e.Description,
            Tags = DeserializeList<string>(e.TagsJson),
            DisplayOrder = e.DisplayOrder,
            IsActive = e.IsActive
        }).ToList();

        return Ok(ApiResponse<List<ExperienceDto>>.Ok(dtoList));
    }

    [HttpGet("education")]
    public async Task<ActionResult<ApiResponse<List<EducationDto>>>> GetEducations()
    {
        var educations = await _context.Educations
            .Where(e => e.IsActive)
            .OrderBy(e => e.DisplayOrder)
            .ToListAsync();

        var dtoList = educations.Select(e => new EducationDto
        {
            Id = e.Id,
            Degree = e.Degree,
            Period = e.Period,
            Institution = e.Institution,
            Description = e.Description,
            DisplayOrder = e.DisplayOrder,
            IsActive = e.IsActive
        }).ToList();

        return Ok(ApiResponse<List<EducationDto>>.Ok(dtoList));
    }

    [HttpGet("certifications")]
    public async Task<ActionResult<ApiResponse<List<CertificationDto>>>> GetCertifications()
    {
        var certs = await _context.Certifications
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        var dtoList = certs.Select(c => new CertificationDto
        {
            Id = c.Id,
            Title = c.Title,
            Level = c.Level,
            Issuer = c.Issuer,
            Description = c.Description,
            DisplayOrder = c.DisplayOrder,
            IsActive = c.IsActive
        }).ToList();

        return Ok(ApiResponse<List<CertificationDto>>.Ok(dtoList));
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
