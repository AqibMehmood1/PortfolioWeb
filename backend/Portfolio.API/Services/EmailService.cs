using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Portfolio.API.DTOs;

namespace Portfolio.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly SmtpSettings _settings;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        
        _settings = new SmtpSettings();
        var section = _configuration.GetSection("SmtpSettings");
        if (section.Exists())
        {
            section.Bind(_settings);
        }
    }

    public async Task SendInquiryEmailsAsync(
        string applicantName,
        string applicantEmail,
        string phone,
        string company,
        string subject,
        string techStack,
        string message,
        string? attachmentUrl = null,
        string? attachmentFileName = null)
    {
        // 1. Clean message for display
        var cleanMessage = message
            .Replace("\r\n", "<br/>")
            .Replace("\n", "<br/>");

        // 2. Send Applicant Confirmation Email
        if (!string.IsNullOrWhiteSpace(applicantEmail) && applicantEmail.Contains('@'))
        {
            try
            {
                var applicantSubject = $"Inquiry Received - Thank You for Reaching Out to NEXVOYS";
                var applicantHtml = GenerateApplicantConfirmationHtml(
                    applicantName, 
                    subject, 
                    techStack, 
                    cleanMessage, 
                    phone,
                    attachmentFileName);

                await SendEmailAsync(applicantEmail.Trim(), applicantName.Trim(), applicantSubject, applicantHtml);
                _logger.LogInformation("Sent applicant inquiry confirmation email to {Email}", applicantEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send confirmation email to applicant {Email}", applicantEmail);
            }
        }

        // 3. Send Internal Notification Email to Owner & Manager
        var adminRecipients = (_settings.AdminNotificationEmails ?? new List<string>())
            .Select(e => e.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        if (!adminRecipients.Contains("bilalsoftengr@gmail.com")) adminRecipients.Add("bilalsoftengr@gmail.com");
        if (!adminRecipients.Contains("aqibsofteng@gmail.com")) adminRecipients.Add("aqibsofteng@gmail.com");

        try
        {
            var adminSubject = $"🔥 [New Lead] {applicantName} - {techStack}";
            var adminHtml = GenerateAdminLeadNotificationHtml(
                applicantName, 
                applicantEmail, 
                phone, 
                company, 
                subject, 
                techStack, 
                cleanMessage, 
                attachmentUrl, 
                attachmentFileName);

            await SendEmailToMultipleAsync(adminRecipients, adminSubject, adminHtml, replyTo: applicantEmail.Trim());
            _logger.LogInformation("Sent admin lead notifications to {Recipients}", string.Join(", ", adminRecipients));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send admin notification emails for inquiry from {Name}", applicantName);
        }
    }

    public async Task<bool> SendEmailAsync(
        string toEmail, 
        string toName, 
        string subject, 
        string htmlBody, 
        string? replyTo = null)
    {
        return await SendEmailToMultipleAsync(new List<string> { toEmail }, subject, htmlBody, replyTo);
    }

    private async Task<bool> SendEmailToMultipleAsync(
        List<string> toEmails, 
        string subject, 
        string htmlBody, 
        string? replyTo = null)
    {
        if (toEmails == null || toEmails.Count == 0) return false;

        // Skip sending if password not configured yet
        if (string.IsNullOrWhiteSpace(_settings.Password))
        {
            _logger.LogWarning("SMTP Password is not configured in SmtpSettings. Email to {To} was skipped.", string.Join(", ", toEmails));
            return false;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        
        foreach (var email in toEmails)
        {
            if (!string.IsNullOrWhiteSpace(email))
            {
                message.To.Add(MailboxAddress.Parse(email.Trim()));
            }
        }

        if (!string.IsNullOrWhiteSpace(replyTo))
        {
            message.ReplyTo.Add(MailboxAddress.Parse(replyTo.Trim()));
        }

        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody
        };
        message.Body = bodyBuilder.ToMessageBody();

        // Connection strategy: Try primary host with SSL, fallback host if error
        var hostsToTry = new[] { _settings.Host, _settings.FallbackHost }
            .Where(h => !string.IsNullOrWhiteSpace(h))
            .Distinct()
            .ToArray();

        Exception? lastException = null;

        foreach (var host in hostsToTry)
        {
            try
            {
                using var client = new SmtpClient();
                // Accept all SSL certs to prevent hostname mismatch on Plesk servers
                client.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;

                // Determine secure options based on port
                var secureOption = _settings.Port == 465 
                    ? SecureSocketOptions.SslOnConnect 
                    : SecureSocketOptions.StartTlsWhenAvailable;

                _logger.LogInformation("Connecting to SMTP {Host}:{Port} with {Option}...", host, _settings.Port, secureOption);
                await client.ConnectAsync(host, _settings.Port, secureOption);

                await client.AuthenticateAsync(_settings.Username, _settings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email successfully dispatched via {Host} to {Count} recipients.", host, toEmails.Count);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send email via {Host}:{Port}. Trying next candidate if available...", host, _settings.Port);
                lastException = ex;
            }
        }

        _logger.LogError(lastException, "All SMTP delivery attempts failed for subject '{Subject}'.", subject);
        return false;
    }

    #region HTML Email Templates

    private static string RenderTechChips(string techStack)
    {
        if (string.IsNullOrWhiteSpace(techStack)) 
            return "<span style=\"color: #64748b; font-size: 13px;\">General Architecture Consultation</span>";
        
        var items = techStack.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                             .Select(s => s.Trim())
                             .Where(s => !string.IsNullOrWhiteSpace(s))
                             .ToList();

        if (items.Count == 0)
            return "<span style=\"color: #64748b; font-size: 13px;\">General Architecture Consultation</span>";

        var chips = items.Select(item =>
            $"<span style=\"display: inline-block; padding: 4px 10px; margin: 2px 4px 2px 0; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; font-weight: 700; color: #0f172a;\">{System.Net.WebUtility.HtmlEncode(item)}</span>");

        return string.Join(" ", chips);
    }

    private string GenerateApplicantConfirmationHtml(
        string name, 
        string subject, 
        string techStack, 
        string messageHtml, 
        string phone,
        string? attachmentFileName)
    {
        var safeName = System.Net.WebUtility.HtmlEncode(name);
        var safeSubject = System.Net.WebUtility.HtmlEncode(subject);
        var safePhone = string.IsNullOrWhiteSpace(phone) ? "Not provided" : System.Net.WebUtility.HtmlEncode(phone);
        var techChips = RenderTechChips(techStack);

        var attBlock = "";
        if (!string.IsNullOrWhiteSpace(attachmentFileName))
        {
            var safeFile = System.Net.WebUtility.HtmlEncode(attachmentFileName);
            attBlock = $@"
              <div style=""margin-top: 14px; padding-top: 12px; border-top: 1px solid #edf2f7;"">
                <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px;"">Attached Document</span>
                <span style=""display: block; font-size: 13px; font-weight: 600; color: #0f172a;"">📎 {safeFile}</span>
              </div>";
        }

        return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Inquiry Confirmation</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;"">
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f1f5f9; padding: 24px 12px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);"">
          <!-- Header Banner -->
          <tr>
            <td style=""background: linear-gradient(135deg, #0b1329 0%, #162347 100%); padding: 28px 24px 24px 24px; border-bottom: 3px solid #b8f500;"">
              <span style=""display: inline-block; padding: 4px 12px; background-color: rgba(184, 245, 0, 0.15); border: 1px solid #b8f500; border-radius: 9999px; color: #b8f500; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;"">
                NEXVOYS · ARCHITECTURAL PARTNER
              </span>
              <h1 style=""margin: 0 0 6px 0; color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.3;"">
                We've Received Your Inquiry
              </h1>
              <p style=""margin: 0; color: #94a3b8; font-size: 13px;"">
                Direct Consultation &amp; Engineering Advisory
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style=""padding: 24px;"">
              <p style=""margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #0f172a;"">
                Hello <strong>{safeName}</strong>,
              </p>
              <p style=""margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Thank you for reaching out to <strong>NEXVOYS</strong>. We have successfully logged your project consultation request. Our engineering leadership team is actively reviewing your scope and technical objectives.
              </p>

              <!-- Submission Summary Grid -->
              <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;"">
                <tr>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; width: 60%; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px;"">Consultation Topic</span>
                    <span style=""display: block; font-size: 14px; font-weight: 700; color: #0f172a;"">{safeSubject}</span>
                  </td>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; width: 40%; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px;"">Contact Phone</span>
                    <span style=""display: block; font-size: 14px; font-weight: 600; color: #0f172a;"">{safePhone}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan=""2"" style=""padding: 12px 16px;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;"">Target Tech Stack</span>
                    <div>{techChips}</div>
                    {attBlock}
                  </td>
                </tr>
              </table>

              <!-- Next Steps Callout -->
              <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; margin-bottom: 24px;"">
                <tr>
                  <td style=""padding: 14px 16px; color: #166534; font-size: 13px; line-height: 1.6;"">
                    ⏱ <strong>What happens next?</strong><br/>
                    Principal Architect Bilal &amp; the NEXVOYS solutions team will analyze your requirements and follow up within <strong>24 business hours</strong> with technical recommendations, diagnostic feasibility, or an invite to a direct strategy session.
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""margin-bottom: 24px;"">
                <tr>
                  <td>
                    <a href=""https://wa.me/923456466188"" target=""_blank"" style=""display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #25D366; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);"">
                      💬 Chat Directly on WhatsApp (+92 345 6466188) ↗
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style=""margin: 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Warm regards,<br/>
                <strong style=""color: #0f172a;"">NEXVOYS Advisory &amp; Solutions Leadership</strong><br/>
                <a href=""mailto:info@nexvoys.com"" style=""color: #2563eb; text-decoration: none; font-weight: 600;"">info@nexvoys.com</a> &middot; <a href=""https://nexvoys.com"" style=""color: #64748b; text-decoration: none;"">nexvoys.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style=""background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; line-height: 1.6;"">
              &copy; {DateTime.UtcNow.Year} NEXVOYS Ltd. Founder-led Architecture Partner for Startups &amp; SMBs.<br/>
              Lahore HQ &middot; Serving clients worldwide across US, Canada, Europe, Singapore &amp; Cyprus.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
    }

    private string GenerateAdminLeadNotificationHtml(
        string name, 
        string email, 
        string phone, 
        string company, 
        string subject, 
        string techStack, 
        string messageHtml,
        string? attachmentUrl,
        string? attachmentFileName)
    {
        var safeName = System.Net.WebUtility.HtmlEncode(name);
        var safeEmail = System.Net.WebUtility.HtmlEncode(email);
        var safePhone = string.IsNullOrWhiteSpace(phone) ? "Not provided" : System.Net.WebUtility.HtmlEncode(phone);
        var safeCompany = string.IsNullOrWhiteSpace(company) ? "Individual / Confidential" : System.Net.WebUtility.HtmlEncode(company);
        var safeSubject = System.Net.WebUtility.HtmlEncode(subject);
        var techChips = RenderTechChips(techStack);

        var attCard = "";
        if (!string.IsNullOrWhiteSpace(attachmentFileName))
        {
            var safeFileName = System.Net.WebUtility.HtmlEncode(attachmentFileName);
            var downloadBtn = !string.IsNullOrWhiteSpace(attachmentUrl)
                ? $@"<td style=""padding: 12px 14px; text-align: right; vertical-align: middle; white-space: nowrap;"">
                       <a href=""{attachmentUrl}"" target=""_blank"" style=""display: inline-block; padding: 7px 14px; background-color: #0f172a; color: #ffffff; font-size: 12px; font-weight: 700; border-radius: 6px; text-decoration: none;"">Download ↗</a>
                     </td>"
                : "";

            attCard = $@"
              <div style=""margin-bottom: 20px;"">
                <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;"">Attached Document</span>
                <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;"">
                  <tr>
                    <td style=""padding: 12px 14px; width: 30px; vertical-align: middle;"">
                      <span style=""font-size: 20px;"">📎</span>
                    </td>
                    <td style=""padding: 12px 0; vertical-align: middle;"">
                      <div style=""font-size: 13px; font-weight: 700; color: #0f172a; word-break: break-all;"">{safeFileName}</div>
                      <div style=""font-size: 11px; color: #64748b;"">Uploaded by Applicant</div>
                    </td>
                    {downloadBtn}
                  </tr>
                </table>
              </div>";
        }

        return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>New Lead Alert</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;"">
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f1f5f9; padding: 24px 12px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);"">
          
          <!-- Header Banner -->
          <tr>
            <td style=""background: linear-gradient(135deg, #0b1329 0%, #162347 100%); padding: 28px 24px 24px 24px; border-bottom: 3px solid #b8f500;"">
              <span style=""display: inline-block; padding: 4px 12px; background-color: #b8f500; border-radius: 9999px; color: #080d1a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;"">
                🔥 INBOUND CLIENT LEAD
              </span>
              <h1 style=""margin: 0 0 6px 0; color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.3;"">
                New Inquiry from {safeName}
              </h1>
              <p style=""margin: 0; color: #94a3b8; font-size: 13px;"">
                Received {DateTime.UtcNow:MMM dd, yyyy · hh:mm tt} UTC via Website Portal
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style=""padding: 24px;"">

              <!-- Lead Details Grid -->
              <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;"">
                <tr>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; width: 50%; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;"">Applicant Name</span>
                    <span style=""display: block; font-size: 15px; font-weight: 700; color: #0f172a;"">{safeName}</span>
                  </td>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; width: 50%; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;"">Company</span>
                    <span style=""display: block; font-size: 14px; font-weight: 600; color: #334155;"">{safeCompany}</span>
                  </td>
                </tr>
                <tr>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;"">Email Address</span>
                    <a href=""mailto:{safeEmail}"" style=""display: block; font-size: 14px; font-weight: 700; color: #2563eb; text-decoration: none; word-break: break-all;"">{safeEmail}</a>
                  </td>
                  <td style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7; vertical-align: top;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;"">Phone / WhatsApp</span>
                    <span style=""display: block; font-size: 14px; font-weight: 600; color: #0f172a;"">{safePhone}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan=""2"" style=""padding: 12px 16px; border-bottom: 1px solid #edf2f7;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;"">Inquiry Subject</span>
                    <span style=""display: block; font-size: 14px; font-weight: 600; color: #0f172a;"">{safeSubject}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan=""2"" style=""padding: 12px 16px;"">
                    <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;"">Requested Tech Stack</span>
                    <div>{techChips}</div>
                  </td>
                </tr>
              </table>

              <!-- Attached File Block -->
              {attCard}

              <!-- Client Message Body -->
              <div style=""margin-bottom: 24px;"">
                <span style=""display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;"">Message Content</span>
                <div style=""background-color: #f8fafc; border-left: 4px solid #0f172a; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 18px; color: #1e293b; font-size: 14px; line-height: 1.6; word-break: break-word;"">
                  {messageHtml}
                </div>
              </div>

              <!-- Quick Actions (Stacked Full-Width Buttons) -->
              <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""margin-top: 10px;"">
                <tr>
                  <td style=""padding-bottom: 10px;"">
                    <a href=""mailto:{safeEmail}?subject=Re:%20{Uri.EscapeDataString(subject)}"" style=""display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #0f172a; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);"">
                      ✉️ Reply Directly to Client
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href=""https://nexvoys.com/admin/inquiries"" target=""_blank"" style=""display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 20px; border-radius: 10px;"">
                      Open Admin Leads Dashboard ↗
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style=""background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center;"">
              <p style=""margin: 0; font-size: 12px; color: #64748b; line-height: 1.6;"">
                Delivered automatically to NEXVOYS Leadership<br/>
                <span style=""color: #334155; font-weight: 600;"">Bilal (Owner)</span> &middot; <span style=""color: #334155; font-weight: 600;"">Aqib (Manager)</span><br/>
                <span style=""font-size: 11px; color: #94a3b8;"">&copy; {DateTime.UtcNow.Year} NEXVOYS Ltd. All rights reserved.</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
    }

    #endregion
}
