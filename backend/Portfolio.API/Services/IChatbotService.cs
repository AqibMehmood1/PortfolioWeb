using Portfolio.API.DTOs;

namespace Portfolio.API.Services;

public interface IChatbotService
{
    Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto request);
    Task<bool> RecordLeadInquiryAsync(SubmitChatInquiryDto dto, string? ipAddress);
}
