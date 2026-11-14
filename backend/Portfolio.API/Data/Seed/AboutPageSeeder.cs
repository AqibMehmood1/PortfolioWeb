using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class AboutPageSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var existing = await context.AboutContents.FirstOrDefaultAsync(a => a.SectionKey == "about-main");
        var about = existing ?? new AboutContent { SectionKey = "about-main" };

        about.Headline = "Enterprise Architecture & Engineering Strategy";
        about.Subtitle = "Enterprise software engineering and architecture studio for high-growth SaaS platforms, autonomous AI workflows, and mission-critical cloud infrastructure.";
        about.VisionHeadline = "Senior Architecture Delivery. Zero Bureaucracy, Zero Junior Handoffs.";
        about.VisionLead = "NEXVOYS is an elite engineering and solutions architecture studio delivering mission-critical systems across North America, Europe, and Asia. We partner directly with engineering leadership to architect, modernize, and ship software that scales.";
        about.VisionDescription = "We believe successful software starts with clean system boundaries, unit economics, and data isolation before writing a single line of code. Our clients collaborate directly with senior architects who design, test, and ship production systems.";
        about.FocusAreasJson = JsonSerializer.Serialize(new[]
        {
            "Designing multi-tenant SaaS foundations with clean data isolation from day one.",
            "Refactoring monolithic architectures into high-velocity, cloud-native microservices.",
            "Integrating autonomous AI agents and enterprise RAG pipelines that automate complex manual work.",
            "Auditing and optimizing Azure/AWS cloud infrastructures to cut operational spend by up to 25%."
        });
        about.ExecutionStepsJson = JsonSerializer.Serialize(new[]
        {
            new { Step = "01", Title = "Discovery & Scoping", Description = "Aligning business KPIs, concurrency needs, and cloud unit economics." },
            new { Step = "02", Title = "Architecture Blueprint", Description = "Designing modular domain boundaries, database schemas, and API contracts." },
            new { Step = "03", Title = "Senior Execution", Description = "Shipping resilient microservices, modern frontends, and automated CI/CD pipelines." },
            new { Step = "04", Title = "Handover & Governance", Description = "Comprehensive written documentation, telemetry, and zero vendor lock-in." }
        });
        about.ValueCardsJson = JsonSerializer.Serialize(new[]
        {
            new { Title = "Direct Senior Engineering", Description = "You collaborate directly with senior enterprise architects and technical leads — zero agency bureaucracy, no account managers, and no junior hand-offs." },
            new { Title = "100% IP & Code Ownership", Description = "You own every line of code, infrastructure script, and architecture diagram from day one." },
            new { Title = "Measurable Cost Discipline", Description = "We design cloud systems to be lean by default, rightsizing compute and eliminating cloud waste." },
            new { Title = "Time-Zone Alignment", Description = "Dedicated overlap hours for US Eastern & Pacific, plus same-day working overlap with Singapore and Europe." }
        });
        about.ThreeStepProcessJson = JsonSerializer.Serialize(new[]
        {
            new { Step = "01", Title = "Discovery Call", Description = "A 30-minute technical session to discuss your roadmap, bottlenecks, and timeline." },
            new { Step = "02", Title = "Blueprint or Audit", Description = "A focused technical roadmap, architecture design, and fixed-scope delivery plan." },
            new { Step = "03", Title = "Production Delivery", Description = "Hands-on architectural implementation, code reviews, and production rollout." }
        });

        if (existing == null)
        {
            about.CreatedAt = DateTime.UtcNow;
            await context.AboutContents.AddAsync(about);
        }
        await context.SaveChangesAsync();
    }
}
