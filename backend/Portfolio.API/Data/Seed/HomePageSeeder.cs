using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class HomePageSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        if (!await context.HomePageContents.AnyAsync(h => h.SectionKey == "hero"))
        {
            var hero = new HomePageContent
            {
                SectionKey = "hero",
                Headline = "Enterprise Solutions Architect & Technology Partner",
                Subtitle = "Helping Startups, SMBs, and Enterprises architect scalable SaaS products, autonomous AI agents, and high-performance cloud applications.",
                TypedStringsJson = JsonSerializer.Serialize(new[]
                {
                    "Enterprise Solutions Architect",
                    "Scalable SaaS & Multi-Tenancy",
                    "Autonomous AI Agents & GenAI",
                    "Cloud Cost Tuning (Azure & AWS)",
                    ".NET 9 & Microservices Architecture",
                    "Fractional CTO & Strategic Advisory"
                }),
                StatsJson = JsonSerializer.Serialize(new[]
                {
                    new { Value = "9+", Label = "Years Enterprise Delivery", Icon = "fas fa-history" },
                    new { Value = "25%", Label = "Avg Cloud Cost Reduction", Icon = "fas fa-chart-line" },
                    new { Value = "99.9%", Label = "Uptime & SLA Resilience", Icon = "fas fa-shield-alt" },
                    new { Value = "30s", Label = "CPQ Calculation Turnaround", Icon = "fas fa-bolt" }
                }),
                AdditionalDataJson = JsonSerializer.Serialize(new
                {
                    HeroBadge = "Enterprise Solutions Architecture",
                    CtaPrimaryText = "Schedule Architecture Strategy Session",
                    CtaSecondaryText = "Explore Delivered Case Studies",
                    TrustBadge = "Trusted by founders across US, Canada, Europe & Worldwide"
                }),
                CreatedAt = DateTime.UtcNow
            };

            await context.HomePageContents.AddAsync(hero);
            await context.SaveChangesAsync();
        }
    }
}
