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
[Route("api/admin/media")]
[Authorize]
public class AdminMediaController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorage;
    private readonly IAuditLogService _auditLog;

    public AdminMediaController(
        ApplicationDbContext context,
        IFileStorageService fileStorage,
        IAuditLogService auditLog)
    {
        _context = context;
        _fileStorage = fileStorage;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<MediaFileDto>>>> GetMediaFiles([FromQuery] PaginationQuery query)
    {
        var dbQuery = _context.MediaFiles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            dbQuery = dbQuery.Where(m => m.FileName.ToLower().Contains(s) || (m.AltText != null && m.AltText.ToLower().Contains(s)));
        }

        var total = await dbQuery.CountAsync();
        var items = await dbQuery
            .OrderByDescending(m => m.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var dtoList = items.Select(m => new MediaFileDto
        {
            Id = m.Id,
            FileName = m.FileName,
            OriginalFileName = m.OriginalFileName,
            FilePath = m.FilePath,
            Url = m.FilePath.StartsWith("http") ? m.FilePath : $"{baseUrl}/{m.FilePath.TrimStart('/')}",
            ContentType = m.ContentType,
            FileSizeBytes = m.FileSizeBytes,
            AltText = m.AltText,
            CreatedAt = m.CreatedAt
        }).ToList();

        return Ok(ApiResponse<PagedResult<MediaFileDto>>.Ok(PagedResult<MediaFileDto>.Create(dtoList, query.Page, query.PageSize, total)));
    }

    [HttpPost("upload")]
    public async Task<ActionResult<ApiResponse<MediaFileDto>>> UploadFile([FromForm] IFormFile file, [FromForm] string? altText)
    {
        var (success, relativePath, originalName, error) = await _fileStorage.SaveFileAsync(file);
        if (!success)
        {
            return BadRequest(ApiResponse.Fail(error));
        }

        var media = new MediaFile
        {
            FileName = Path.GetFileName(relativePath),
            OriginalFileName = originalName,
            FilePath = relativePath,
            ContentType = file.ContentType,
            FileSizeBytes = file.Length,
            AltText = altText ?? originalName,
            UploadedBy = User.Identity?.Name ?? "Admin",
            CreatedAt = DateTime.UtcNow
        };

        await _context.MediaFiles.AddAsync(media);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UploadMedia", "MediaFile", media.Id.ToString(), $"Uploaded file '{originalName}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var dto = new MediaFileDto
        {
            Id = media.Id,
            FileName = media.FileName,
            OriginalFileName = media.OriginalFileName,
            FilePath = media.FilePath,
            Url = $"{baseUrl}/{media.FilePath.TrimStart('/')}",
            ContentType = media.ContentType,
            FileSizeBytes = media.FileSizeBytes,
            AltText = media.AltText,
            CreatedAt = media.CreatedAt
        };

        return Ok(ApiResponse<MediaFileDto>.Ok(dto, "File uploaded successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMedia(int id)
    {
        var media = await _context.MediaFiles.FindAsync(id);
        if (media == null) return NotFound(ApiResponse.Fail("Media file not found."));

        _fileStorage.DeleteFile(media.FilePath);
        _context.MediaFiles.Remove(media);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteMedia", "MediaFile", id.ToString(), $"Deleted file '{media.OriginalFileName}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Media file deleted successfully."));
    }
}
