using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Common;
using Portfolio.API.DTOs;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatbotService _chatbotService;

    public ChatController(IChatbotService chatbotService)
    {
        _chatbotService = chatbotService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ChatResponseDto>>> SendMessage([FromBody] ChatRequestDto request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(ApiResponse.Fail("Message cannot be empty."));
        }

        var response = await _chatbotService.ProcessMessageAsync(request);
        return Ok(ApiResponse<ChatResponseDto>.Ok(response));
    }

    [HttpPost("inquiry")]
    public async Task<ActionResult<ApiResponse<object>>> SubmitInquiry([FromBody] SubmitChatInquiryDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(ApiResponse.Fail("Name and Email are required."));
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var success = await _chatbotService.RecordLeadInquiryAsync(dto, ip);

        return Ok(ApiResponse<object>.Ok(new { success = true }, "Inquiry received. The NEXVOYS team will reach out within 24 hours."));
    }
}
