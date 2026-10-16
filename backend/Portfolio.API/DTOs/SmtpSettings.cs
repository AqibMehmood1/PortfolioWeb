namespace Portfolio.API.DTOs;

public class SmtpSettings
{
    public string Host { get; set; } = "mail.nexvoys.com";
    public string FallbackHost { get; set; } = "plesk8800.is.cc";
    public int Port { get; set; } = 465;
    public bool UseSsl { get; set; } = true;
    public string Username { get; set; } = "info@nexvoys.com";
    public string Password { get; set; } = "sporttop101";
    public string FromEmail { get; set; } = "info@nexvoys.com";
    public string FromName { get; set; } = "NEXVOYS";
    public List<string> AdminNotificationEmails { get; set; } = new()
    {
        "bilalsoftengr@gmail.com",
        "aqibsofteng@gmail.com"
    };
}
