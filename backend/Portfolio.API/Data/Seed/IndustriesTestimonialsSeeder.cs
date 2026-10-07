using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class IndustriesTestimonialsSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var industries = new List<Industry>
        {
            new()
            {
                Title = "Fintech & Digital Banking",
                Icon = "fas fa-shield-alt",
                Description = "Secure, high-availability customer portals, strict RBAC authorization, and zero-trust transaction processing.",
                Project = "Eurobank Banking Portal",
                Metric = "Zero-Downtime Resilience",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Title = "Multi-Tenant Cloud SaaS",
                Icon = "fas fa-cloud",
                Description = "Elastic microservices, automated tenant partitioning, Stripe subscription billing, and automated CI/CD.",
                Project = "Cloudoor Cloud SaaS",
                Metric = "25% Cloud Cost Optimization",
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Title = "HealthTech & Telemedicine",
                Icon = "fas fa-heartbeat",
                Description = "Encrypted patient consultation pipelines, WebSockets live messaging, and HIPAA-aligned architecture.",
                Project = "Medikea Health Platform",
                Metric = "High Concurrency Queues",
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Title = "Enterprise CPQ & Pricing Engines",
                Icon = "fas fa-calculator",
                Description = "Dynamic formula calculation engines that replace error-prone manual spreadsheets with automated workflows.",
                Project = "ODTool Quotation Engine",
                Metric = "3 Hours/Day Saved",
                DisplayOrder = 4,
                IsActive = true
            },
            new()
            {
                Title = "High-Traffic Web Portals & SPAs",
                Icon = "fas fa-bolt",
                Description = "Distributed Redis caching, non-blocking asynchronous APIs, and CDN edge optimization for instant render.",
                Project = "Scrole & LinksCenter",
                Metric = "Sub-Second Latency",
                DisplayOrder = 5,
                IsActive = true
            },
            new()
            {
                Title = "AI Agents & Intelligent Workflows",
                Icon = "fas fa-robot",
                Description = "Autonomous LLM tool-calling agents, enterprise RAG vector retrieval, and automated document parsing.",
                Project = "Pulstech AI Integrations",
                Metric = "Enterprise LLM Pipelines",
                DisplayOrder = 6,
                IsActive = true
            }
        };

        foreach (var ind in industries)
        {
            if (!await context.Industries.AnyAsync(i => i.Title == ind.Title))
            {
                await context.Industries.AddAsync(ind);
            }
        }

        var testimonials = new List<Testimonial>
        {
            new()
            {
                Quote = "The NEXVOYS team architected our dynamic CPQ calculation engine from the ground up. Their architectural leadership cut our quotation turnaround time from 3 hours to under 30 seconds. Extraordinary technical mastery.",
                Author = "Odyssey Design Leadership",
                Role = "San Antonio, TX, USA",
                Tag = "Enterprise .NET & CPQ",
                Rating = 5,
                DisplayOrder = 1,
                IsPublished = true
            },
            new()
            {
                Quote = "NEXVOYS has an exceptional ability to integrate complex GenAI agent workflows while ensuring cloud infrastructure remains cost-optimized. An invaluable technology partner.",
                Author = "Pulstech Engineering",
                Role = "Paris, France",
                Tag = "Cloud & AI Architecture",
                Rating = 5,
                DisplayOrder = 2,
                IsPublished = true
            },
            new()
            {
                Quote = "Delivered our multi-tenant SaaS infrastructure on Azure with flawless execution. Zero-downtime deployments and reduced our monthly cloud bill by 25%.",
                Author = "Cloudoor Technology Team",
                Role = "San Francisco, CA, USA",
                Tag = "Multi-Tenant SaaS",
                Rating = 5,
                DisplayOrder = 3,
                IsPublished = true
            }
        };

        foreach (var t in testimonials)
        {
            if (!await context.Testimonials.AnyAsync(x => x.Author == t.Author && x.Tag == t.Tag))
            {
                await context.Testimonials.AddAsync(t);
            }
        }

        await context.SaveChangesAsync();
    }
}
