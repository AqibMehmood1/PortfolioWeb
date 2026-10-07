using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<ContactController> _logger;

    public ContactController(ApplicationDbContext dbContext, ILogger<ContactController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitMessage([FromBody] ContactMessage message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            message.CreatedAt = DateTime.UtcNow;
            _dbContext.ContactMessages.Add(message);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Thank you for reaching out! Your message has been received.",
                id = message.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving contact message");
            return StatusCode(500, new { success = false, error = "Failed to save message. " + ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _dbContext.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
        return Ok(messages);
    }
}
