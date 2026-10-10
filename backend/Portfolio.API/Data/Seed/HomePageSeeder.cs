using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class HomePageSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var existing = await context.HomePageContents.FirstOrDefaultAsync(h => h.SectionKey == "hero");
        var hero = existing ?? new HomePageContent { SectionKey = "hero" };

        hero.Headline = "Senior architecture for SaaS and AI products that need to scale.";
        hero.Subtitle = "Nexvoys is a founder-led technology partner for startups and SMBs in the US, Canada, Singapore and Cyprus. You work directly with a principal architect with 9+ years shipping .NET, Azure and AI systems — from first blueprint to production.";
        hero.TypedStringsJson = JsonSerializer.Serialize(new[]
        {
            "Principal Solutions Architect",
            "Multi-Tenant SaaS Architecture",
            "Autonomous AI Agents & Pipelines",
            "Cloud Cost Optimization (Azure & AWS)",
            ".NET 9 & Microservices Modernization",
            "Fractional CTO & Strategic Advisory"
        });
        hero.StatsJson = JsonSerializer.Serialize(new[]
        {
            new { Value = "9+", Label = "Years Shipping Systems", Icon = "fas fa-history" },
            new { Value = "25%", Label = "Cloud Cost Reduction", Icon = "fas fa-chart-line" },
            new { Value = "< 30s", Label = "CPQ Turnaround (from 3 hrs)", Icon = "fas fa-bolt" },
            new { Value = "4", Label = "Key Markets: US, CA, SG, CY", Icon = "fas fa-globe" }
        });
        hero.AdditionalDataJson = JsonSerializer.Serialize(new
        {
            HeroBadge = "Founder-Led Solutions Architecture",
            CtaPrimaryText = "Book a 30-min architecture call",
            CtaSecondaryText = "See selected work",
            TrustBadge = "Direct founder access · Same-day overlap across US, Singapore & Cyprus"
        });

        if (existing == null)
        {
            hero.CreatedAt = DateTime.UtcNow;
            await context.HomePageContents.AddAsync(hero);
        }
        await context.SaveChangesAsync();
    }
}
