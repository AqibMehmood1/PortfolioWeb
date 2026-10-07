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
[Route("api/admin/experience")]
[Authorize]
public class AdminExperienceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminExperienceController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ExperienceDto>>>> GetExperiences()
    {
        var list = await _context.Experiences.OrderBy(e => e.DisplayOrder).ToListAsync();
        var dtoList = list.Select(e => new ExperienceDto
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

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> CreateExperience([FromBody] CreateUpdateExperienceDto dto)
    {
        var entity = new Experience
        {
            Title = dto.Title.Trim(),
            Period = dto.Period?.Trim() ?? string.Empty,
            Company = dto.Company?.Trim() ?? string.Empty,
            Location = dto.Location?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            TagsJson = JsonSerializer.Serialize(dto.Tags ?? new()),
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Experiences.AddAsync(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateExperience", "Experience", entity.Id.ToString(), $"Added experience '{entity.Title}' at {entity.Company}", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var result = new ExperienceDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Period = entity.Period,
            Company = entity.Company,
            Location = entity.Location,
            Description = entity.Description,
            Tags = dto.Tags ?? new(),
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<ExperienceDto>.Ok(result, "Experience created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> UpdateExperience(int id, [FromBody] CreateUpdateExperienceDto dto)
    {
        var entity = await _context.Experiences.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Experience not found."));

        entity.Title = dto.Title.Trim();
        entity.Period = dto.Period?.Trim() ?? string.Empty;
        entity.Company = dto.Company?.Trim() ?? string.Empty;
        entity.Location = dto.Location?.Trim() ?? string.Empty;
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.TagsJson = JsonSerializer.Serialize(dto.Tags ?? new());
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateExperience", "Experience", id.ToString(), $"Updated experience '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var result = new ExperienceDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Period = entity.Period,
            Company = entity.Company,
            Location = entity.Location,
            Description = entity.Description,
            Tags = dto.Tags ?? new(),
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };

        return Ok(ApiResponse<ExperienceDto>.Ok(result, "Experience updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteExperience(int id)
    {
        var entity = await _context.Experiences.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Experience not found."));

        _context.Experiences.Remove(entity);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteExperience", "Experience", id.ToString(), $"Deleted experience '{entity.Title}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Experience deleted successfully."));
    }

    // Education
    [HttpGet("education")]
    public async Task<ActionResult<ApiResponse<List<EducationDto>>>> GetEducations()
    {
        var list = await _context.Educations.OrderBy(e => e.DisplayOrder).ToListAsync();
        var dtoList = list.Select(e => new EducationDto
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

    [HttpPost("education")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> CreateEducation([FromBody] CreateUpdateEducationDto dto)
    {
        var entity = new Education
        {
            Degree = dto.Degree.Trim(),
            Period = dto.Period?.Trim() ?? string.Empty,
            Institution = dto.Institution?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Educations.AddAsync(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EducationDto>.Ok(new EducationDto
        {
            Id = entity.Id,
            Degree = entity.Degree,
            Period = entity.Period,
            Institution = entity.Institution,
            Description = entity.Description,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Education created successfully."));
    }

    [HttpPut("education/{id:int}")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> UpdateEducation(int id, [FromBody] CreateUpdateEducationDto dto)
    {
        var entity = await _context.Educations.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Education not found."));

        entity.Degree = dto.Degree.Trim();
        entity.Period = dto.Period?.Trim() ?? string.Empty;
        entity.Institution = dto.Institution?.Trim() ?? string.Empty;
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EducationDto>.Ok(new EducationDto
        {
            Id = entity.Id,
            Degree = entity.Degree,
            Period = entity.Period,
            Institution = entity.Institution,
            Description = entity.Description,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Education updated successfully."));
    }

    [HttpDelete("education/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteEducation(int id)
    {
        var entity = await _context.Educations.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Education not found."));

        _context.Educations.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(null, "Education deleted successfully."));
    }

    // Certifications
    [HttpGet("certifications")]
    public async Task<ActionResult<ApiResponse<List<CertificationDto>>>> GetCertifications()
    {
        var list = await _context.Certifications.OrderBy(c => c.DisplayOrder).ToListAsync();
        var dtoList = list.Select(c => new CertificationDto
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

    [HttpPost("certifications")]
    public async Task<ActionResult<ApiResponse<CertificationDto>>> CreateCertification([FromBody] CreateUpdateCertificationDto dto)
    {
        var entity = new Certification
        {
            Title = dto.Title.Trim(),
            Level = dto.Level?.Trim() ?? string.Empty,
            Issuer = dto.Issuer?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Certifications.AddAsync(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<CertificationDto>.Ok(new CertificationDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Level = entity.Level,
            Issuer = entity.Issuer,
            Description = entity.Description,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Certification created successfully."));
    }

    [HttpPut("certifications/{id:int}")]
    public async Task<ActionResult<ApiResponse<CertificationDto>>> UpdateCertification(int id, [FromBody] CreateUpdateCertificationDto dto)
    {
        var entity = await _context.Certifications.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Certification not found."));

        entity.Title = dto.Title.Trim();
        entity.Level = dto.Level?.Trim() ?? string.Empty;
        entity.Issuer = dto.Issuer?.Trim() ?? string.Empty;
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<CertificationDto>.Ok(new CertificationDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Level = entity.Level,
            Issuer = entity.Issuer,
            Description = entity.Description,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        }, "Certification updated successfully."));
    }

    [HttpDelete("certifications/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCertification(int id)
    {
        var entity = await _context.Certifications.FindAsync(id);
        if (entity == null) return NotFound(ApiResponse.Fail("Certification not found."));

        _context.Certifications.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(null, "Certification deleted successfully."));
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
