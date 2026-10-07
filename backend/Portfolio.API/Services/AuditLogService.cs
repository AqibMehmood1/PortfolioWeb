using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Services;

public interface IAuditLogService
{
    Task LogAsync(string action, string entityName, string? entityId = null, string? details = null, int? userId = null, string? username = null, string? ipAddress = null);
}

public class AuditLogService : IAuditLogService
{
    private readonly ApplicationDbContext _context;

    public AuditLogService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(string action, string entityName, string? entityId = null, string? details = null, int? userId = null, string? username = null, string? ipAddress = null)
    {
        try
        {
            var log = new AuditLog
            {
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = details,
                UserId = userId,
                Username = username ?? "System",
                IpAddress = ipAddress,
                CreatedAt = DateTime.UtcNow
            };

            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
        catch
        {
            // Do not fail main transaction on audit log write error
        }
    }
}
