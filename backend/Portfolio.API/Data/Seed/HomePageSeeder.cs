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

        hero.Headline = "Enterprise software architecture for SaaS and AI systems that scale.";
        hero.Subtitle = "NEXVOYS is an elite engineering and solutions architecture studio. We partner with technology teams, scale-ups, and global enterprises to design resilient cloud architectures, high-performance .NET microservices, and autonomous AI systems.";
        hero.TypedStringsJson = JsonSerializer.Serialize(new[]
        {
            "Enterprise Solutions Architecture",
            "Multi-Tenant SaaS Architecture",
            "Autonomous AI Agents & Pipelines",
            "Cloud Cost Optimization (Azure & AWS)",
            ".NET 9 & Microservices Modernization",
            "Fractional Principal Architecture & Advisory"
        });
        hero.StatsJson = JsonSerializer.Serialize(new[]
        {
            new { Value = "Enterprise", Label = "Production Platforms Shipped", Icon = "fas fa-history" },
            new { Value = "25%", Label = "Cloud Cost Reduction", Icon = "fas fa-chart-line" },
            new { Value = "< 30s", Label = "CPQ Turnaround (from 3 hrs)", Icon = "fas fa-bolt" },
            new { Value = "Global", Label = "Key Markets: US, CA, SG, EU", Icon = "fas fa-globe" }
        });
        hero.AdditionalDataJson = JsonSerializer.Serialize(new
        {
            HeroBadge = "Enterprise Solutions Architecture Studio",
            CtaPrimaryText = "Book Architecture Consultation",
            CtaSecondaryText = "See Selected Work",
            TrustBadge = "Direct Senior Architect Collaboration · Overlapping Delivery Across US, Europe & Asia"
        });

        if (existing == null)
        {
            hero.CreatedAt = DateTime.UtcNow;
            await context.HomePageContents.AddAsync(hero);
        }
        await context.SaveChangesAsync();
    }
}
