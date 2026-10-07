using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContactController> _logger;

    public ContactController(ApplicationDbContext context, ILogger<ContactController> logger)
    {
        _context = context;
        _logger = logger;
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

            return Ok(ApiResponse<object>.Ok(new { id = inquiry.Id }, "Thank you! Your message has been received. I will respond within 24 hours."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save contact inquiry");
            return StatusCode(500, ApiResponse.Fail("Unable to process your inquiry at this moment. Please try again or email directly."));
        }
    }
}
