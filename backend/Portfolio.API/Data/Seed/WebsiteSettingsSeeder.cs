using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class WebsiteSettingsSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var defaultSettings = new List<WebsiteSetting>
        {
            new() { Key = "CompanyName", Value = "NEXVOYS", Group = "Profile", Description = "Company / Brand Name" },
            new() { Key = "Tagline", Value = "Founder-led Architecture Partner for Startups & SMBs", Group = "Profile", Description = "Header Tagline" },
            new() { Key = "Role", Value = "Principal Solutions Architect & Founder", Group = "Profile", Description = "Primary Professional Role" },
            new() { Key = "Email", Value = "hello@nexvoys.com", Group = "Contact", Description = "Primary Email Address" },
            new() { Key = "Phone", Value = "+92 345 6466188", Group = "Contact", Description = "Phone Number (International format)" },
            new() { Key = "DisplayPhone", Value = "+92 345 6466188", Group = "Contact", Description = "Formatted Display Phone" },
            new() { Key = "Location", Value = "Lahore HQ · Serving clients in US, Canada, Singapore & Cyprus", Group = "Contact", Description = "Primary Office Location" },
            new() { Key = "LinkedinUrl", Value = "https://www.linkedin.com/company/nex-voys/posts/?feedView=all", Group = "Social", Description = "LinkedIn Profile / Company URL" },
            new() { Key = "CvPath", Value = "assets/Bilal_CV.pdf", Group = "Profile", Description = "Downloadable CV / Brochure Path" },
            new() { Key = "LogoDark", Value = "assets/nexvoys/black-logo.png", Group = "Media", Description = "Dark Header Logo" },
            new() { Key = "LogoLight", Value = "assets/nexvoys/white-logo.png", Group = "Media", Description = "White Footer Logo" },
            new() { Key = "Favicon", Value = "assets/nexvoys/nex-fav.png", Group = "Media", Description = "Favicon URL" },
            new() { Key = "FooterBio", Value = "Nexvoys is a founder-led architecture and engineering partner for startups and SMBs building SaaS and AI products. Senior-only execution with zero junior handoffs.", Group = "Footer", Description = "Footer Bio Text" },
            new() { Key = "CopyrightText", Value = "© 2026 NEXVOYS Ltd. All rights reserved. Senior Architecture & Advisory.", Group = "Footer", Description = "Copyright notice" },
            new() { 
                Key = "TickerTexts", 
                Value = JsonSerializer.Serialize(new string[] {}), 
                Group = "General", 
                Description = "Top Ticker Marquee items" 
            }
        };

        foreach (var setting in defaultSettings)
        {
            var existing = await context.WebsiteSettings.FirstOrDefaultAsync(s => s.Key == setting.Key);
            if (existing == null)
            {
                await context.WebsiteSettings.AddAsync(setting);
            }
            else
            {
                if (string.IsNullOrEmpty(existing.Group)) existing.Group = setting.Group;
                if (string.IsNullOrEmpty(existing.Description)) existing.Description = setting.Description;
            }
        }

        await context.SaveChangesAsync();
    }
}
