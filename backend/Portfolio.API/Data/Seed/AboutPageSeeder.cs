using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class AboutPageSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        if (!await context.AboutContents.AnyAsync(a => a.SectionKey == "about-main"))
        {
            var about = new AboutContent
            {
                SectionKey = "about-main",
                Headline = "Architectural Philosophy & Strategy",
                Subtitle = "Enterprise Solutions Architect & Technology Partner helping Startups, SMBs, and Enterprises architect scalable SaaS products, autonomous AI agents, and high-performance cloud applications.",
                VisionHeadline = "Technology Decisions Must Directly Drive Revenue & Velocity",
                VisionLead = "With 9+ years of international software delivery across the US, Canada, and Europe, I partner with founders, CEOs, and CTOs to design secure, scalable, and high-performance software.",
                VisionDescription = "I believe successful software starts with understanding unit economics, user growth projections, and business workflows before choosing technologies. The right architecture simplifies ongoing development, reduces cloud bills, and prevents catastrophic rewrites.",
                FocusAreasJson = JsonSerializer.Serialize(new[]
                {
                    "Designing multi-tenant SaaS foundations with clean data isolation from day one.",
                    "Refactoring legacy monolithic .NET systems into modular, high-velocity microservices.",
                    "Integrating autonomous AI agents and enterprise RAG pipelines that automate complex manual work.",
                    "Auditing and optimizing Azure/AWS cloud infrastructures to cut operational costs by up to 25%."
                }),
                ExecutionStepsJson = JsonSerializer.Serialize(new[]
                {
                    new { Step = "01", Title = "Business Discovery", Description = "Aligning KPIs, concurrency demands, and unit economics." },
                    new { Step = "02", Title = "System Blueprint", Description = "Designing modular domain models and elastic schemas." },
                    new { Step = "03", Title = "Rapid Scalable Build", Description = "Developing microservices with .NET 9, Angular/React, and CI/CD." },
                    new { Step = "04", Title = "Scale & Governance", Description = "Real-time telemetry, Redis caching, and cost governance." }
                }),
                ValueCardsJson = JsonSerializer.Serialize(new[]
                {
                    new { Title = "Task Automation", Description = "DevOps and backend architecture screened for proven technical capability, eliminating repetitive manual operations." },
                    new { Title = "Agentic Workflows", Description = "Speeds up execution by connecting systems and streamlining processes across different tools and multi-agent LLM pipelines." },
                    new { Title = "Cost Efficiency", Description = "Lowers operational costs by minimizing manual effort and optimizing compute, caching, and serverless resource utilization." },
                    new { Title = "Resource Efficiency", Description = "Optimizes the use of people, time, and systems by ensuring architecture tasks are handled intelligently with minimal waste." }
                }),
                ThreeStepProcessJson = JsonSerializer.Serialize(new[]
                {
                    new { Step = "01", Title = "Tell Us What You Need", Description = "One quick conversation. Tell us about your team, tech stack, and goals." },
                    new { Step = "02", Title = "Build Your Match Within 24 Hours", Description = "We match AI developers to your stack and workflow. You review them." },
                    new { Step = "03", Title = "Start Shipping Immediately", Description = "Your engineer is embedded, onboarded and contributing." }
                }),
                CreatedAt = DateTime.UtcNow
            };

            await context.AboutContents.AddAsync(about);
            await context.SaveChangesAsync();
        }
    }
}
