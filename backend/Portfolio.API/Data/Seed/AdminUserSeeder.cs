using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class AdminUserSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        if (!await context.AdminUsers.AnyAsync(u => u.Username == "admin"))
        {
            var admin = new AdminUser
            {
                Username = "admin",
                Email = "admin@nexvoys.com",
                FullName = "NEXVOYS SuperAdmin",
                Role = "SuperAdmin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456Secure!"),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.AdminUsers.AddAsync(admin);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded default SuperAdmin user: admin / Admin@123456Secure!");
        }
    }
}
