using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContactController> _logger;
    private readonly IFileStorageService _fileStorage;
    private readonly IEmailService _emailService;

    public ContactController(
        ApplicationDbContext context, 
        ILogger<ContactController> logger,
        IFileStorageService fileStorage,
        IEmailService emailService)
    {
        _context = context;
        _logger = logger;
        _fileStorage = fileStorage;
        _emailService = emailService;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<ApiResponse<object>>> UploadAttachment([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(ApiResponse.Fail("No file provided."));
        }

        var (success, filePath, fileName, error) = await _fileStorage.SaveFileAsync(file, "inquiries");
        if (!success)
        {
            return BadRequest(ApiResponse.Fail(error));
        }

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var fileUrl = $"{baseUrl}/{filePath.TrimStart('/')}";

        return Ok(ApiResponse<object>.Ok(new { filePath, fileName, fileUrl }, "File uploaded successfully."));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> SubmitInquiry([FromBody] SubmitContactInquiryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse.Fail("Please fill out all required fields with valid values."));
        }

        try
        {
            var inquiry = new ContactInquiry
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim(),
                Phone = dto.Phone?.Trim() ?? string.Empty,
                Company = dto.Company?.Trim() ?? string.Empty,
                Subject = dto.Subject?.Trim() ?? "General Consultation",
                TechStack = dto.TechStack?.Trim() ?? string.Empty,
                Message = dto.Message.Trim(),
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            await _context.ContactInquiries.AddAsync(inquiry);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New contact inquiry received from {Email} ({Name})", inquiry.Email, inquiry.Name);

            // Extract any attachment file URL and file name from the message payload
            string? attachmentUrl = null;
            string? attachmentFileName = null;

            var match = System.Text.RegularExpressions.Regex.Match(
                inquiry.Message, 
                @"\[Attached File:\s*([^\-]+?)\s*-\s*([^\]]+)\]", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase);

            if (match.Success)
            {
                attachmentFileName = match.Groups[1].Value.Trim();
                attachmentUrl = match.Groups[2].Value.Trim();
            }
            else
            {
                var mentionMatch = System.Text.RegularExpressions.Regex.Match(
                    inquiry.Message,
                    @"\[Attached File Mention:\s*([^\]]+)\]",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (mentionMatch.Success)
                {
                    attachmentFileName = mentionMatch.Groups[1].Value.Trim();
                }
            }

            var cleanMessage = System.Text.RegularExpressions.Regex.Replace(
                inquiry.Message, 
                @"\[Attached File:[^\]]+\]|\[Attached File Mention:[^\]]+\]", 
                string.Empty).Trim();

            // Asynchronously dispatch confirmation & leadership alert emails
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendInquiryEmailsAsync(
                        inquiry.Name,
                        inquiry.Email,
                        inquiry.Phone,
                        inquiry.Company,
                        inquiry.Subject,
                        inquiry.TechStack,
                        cleanMessage,
                        attachmentUrl,
                        attachmentFileName);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Background email dispatch error for inquiry ID {Id}", inquiry.Id);
                }
            });

            return Ok(ApiResponse<object>.Ok(new { id = inquiry.Id }, "Thank you! Your message has been received. I will respond within 24 hours."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save contact inquiry");
            return StatusCode(500, ApiResponse.Fail("Unable to process your inquiry at this moment. Please try again or email directly."));
        }
    }
}
