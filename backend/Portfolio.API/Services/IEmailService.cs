namespace Portfolio.API.Services;

public interface IEmailService
{
    Task SendInquiryEmailsAsync(
        string applicantName,
        string applicantEmail,
        string phone,
        string company,
        string subject,
        string techStack,
        string message,
        string? attachmentUrl = null,
        string? attachmentFileName = null);

    Task<bool> SendEmailAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        string? replyTo = null);
}
