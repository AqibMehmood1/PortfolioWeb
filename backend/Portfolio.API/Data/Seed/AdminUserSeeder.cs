using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class AdminUserSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var superUser = await context.AdminUsers.FirstOrDefaultAsync(u => 
            u.Email == "bilalsoftengr@gmail.com" || 
            u.Username == "bilalsoftengr@gmail.com" || 
            u.Username == "admin");

        if (superUser == null)
        {
            var admin = new AdminUser
            {
                Username = "bilalsoftengr@gmail.com",
                Email = "bilalsoftengr@gmail.com",
                FullName = "Bilal (NEXVOYS SuperAdmin)",
                Role = "SuperAdmin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123*"),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.AdminUsers.AddAsync(admin);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded default SuperAdmin user: bilalsoftengr@gmail.com / Test123*");
        }
        else
        {
            superUser.Username = "bilalsoftengr@gmail.com";
            superUser.Email = "bilalsoftengr@gmail.com";
            superUser.FullName = "Bilal (NEXVOYS SuperAdmin)";
            superUser.Role = "SuperAdmin";
            superUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123*");
            superUser.IsActive = true;
            await context.SaveChangesAsync();
            logger.LogInformation("Updated SuperAdmin credentials: bilalsoftengr@gmail.com / Test123*");
        }
    }
}

