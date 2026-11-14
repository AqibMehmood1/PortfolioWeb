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

        hero.Headline = "Custom software development for SaaS, Cloud & AI systems that scale.";
        hero.Subtitle = "NEXVOYS is an elite software engineering and cloud development studio. We partner with startups, scale-ups, and global enterprises to build high-performance web platforms, resilient cloud microservices, and autonomous AI systems.";
        hero.TypedStringsJson = JsonSerializer.Serialize(new[]
        {
            "Custom Software Development",
            "Multi-Tenant SaaS Engineering",
            "Autonomous AI Agents & Pipelines",
            "Cloud Cost Optimization (Azure & AWS)",
            "Microservices & Cloud Modernization",
            "Fractional CTO & Technical Advisory"
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
            HeroBadge = "Custom Software & Cloud Engineering Studio",
            CtaPrimaryText = "Book a Discovery Call",
            CtaSecondaryText = "See Selected Work",
            TrustBadge = "Direct Senior Engineer Collaboration · Overlapping Delivery Across US, Europe & Asia"
        });

        if (existing == null)
        {
            hero.CreatedAt = DateTime.UtcNow;
            await context.HomePageContents.AddAsync(hero);
        }
        await context.SaveChangesAsync();
    }
}
