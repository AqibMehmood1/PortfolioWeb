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
            new() { Key = "Tagline", Value = "Enterprise Technology Partner", Group = "Profile", Description = "Header Tagline" },
            new() { Key = "Role", Value = "Enterprise Technology Partner & Solutions Architecture", Group = "Profile", Description = "Primary Professional Role" },
            new() { Key = "Email", Value = "nexvoys@gmail.com", Group = "Contact", Description = "Primary Email Address" },
            new() { Key = "Phone", Value = "+923456466188", Group = "Contact", Description = "Phone Number (E.164 format)" },
            new() { Key = "DisplayPhone", Value = "+92 345 6466188", Group = "Contact", Description = "Formatted Display Phone" },
            new() { Key = "Location", Value = "Lahore, Pakistan · Global Remote", Group = "Contact", Description = "Primary Office Location" },
            new() { Key = "LinkedinUrl", Value = "https://www.linkedin.com/company/nex-voys/posts/?feedView=all", Group = "Social", Description = "LinkedIn Profile / Company URL" },
            new() { Key = "CvPath", Value = "assets/Bilal_CV.pdf", Group = "Profile", Description = "Downloadable CV / Brochure Path" },
            new() { Key = "LogoDark", Value = "assets/nexvoys/black-logo.png", Group = "Media", Description = "Dark Header Logo" },
            new() { Key = "LogoLight", Value = "assets/nexvoys/white-logo.png", Group = "Media", Description = "White Footer Logo" },
            new() { Key = "Favicon", Value = "assets/nexvoys/nex-fav.png", Group = "Media", Description = "Favicon URL" },
            new() { Key = "FooterBio", Value = "NEXVOYS helps Startups, SMBs, and Enterprises architect and scale multi-tenant SaaS platforms, autonomous AI agent pipelines, and high-performance cloud infrastructure with 9+ years of proven delivery.", Group = "Footer", Description = "Footer Bio Text" },
            new() { Key = "CopyrightText", Value = "© 2026 NEXVOYS. All rights reserved. Enterprise Software Architecture & Advisory.", Group = "Footer", Description = "Copyright notice" },
            new() { 
                Key = "TickerTexts", 
                Value = JsonSerializer.Serialize(new[] {
                    "• We're available for Q2/Q3 Architectural Advisory & Scale! Come connect with us!",
                    "• 9+ Years Enterprise Solutions Architecture & Cloud Engineering",
                    "• Multi-Tenant SaaS, Autonomous AI Agents & High-Concurrency Systems",
                    "• Trusted by Tech Leaders across US, Canada, Europe & Worldwide"
                }), 
                Group = "General", 
                Description = "Top Ticker Marquee items" 
            }
        };

        foreach (var setting in defaultSettings)
        {
            if (!await context.WebsiteSettings.AnyAsync(s => s.Key == setting.Key))
            {
                await context.WebsiteSettings.AddAsync(setting);
            }
        }

        await context.SaveChangesAsync();
    }
}
