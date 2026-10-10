using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class ProjectsSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var projects = new List<Project>
        {
            new()
            {
                Slug = "scrole",
                Title = "Scrole Web Platform",
                Category = "Interactive Web Platform",
                FilterCategory = "web",
                Image = "assets/img/scrole.png",
                Gif = "assets/img/Scrole.gif",
                Description = "High-performance interactive web application built for seamless engagement, dynamic rendering, and responsive real-time data sync.",
                Problem = "The client needed a responsive, dynamic web portal capable of smooth animation flows and rapid interaction without compromising page load speeds.",
                Architecture = "Engineered with Angular and clean TypeScript components, utilizing reactive state management and CDN edge caching to ensure ultra-fast response times.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "Angular", "TypeScript", "Node.js", "REST APIs", "Cloud CDN" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Sub-second response time", "Modern reactive TypeScript state", "Global CDN edge caching" }),
                LiveUrl = "",
                DisplayOrder = 1,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "odtool",
                Title = "ODTool Quotation Engine",
                Category = "Enterprise CPQ & Calculation System",
                FilterCategory = "dotnet",
                Image = "assets/img/ODTool.png",
                Gif = "assets/img/OdooTools.gif",
                Description = "Custom quotation calculation engine replacing spreadsheet pricing workflows with an automated system delivering quotes in under 30 seconds.",
                Problem = "Sales and estimation teams spent over 3 hours daily calculating complex custom equipment quotes in spreadsheets with calculation drift and quote turnaround delays.",
                Architecture = "Engineered an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with granular role-based permissions.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { ".NET Core", "C#", "SQL Server", "Angular", "Azure App Services" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Turnaround: 3 hrs to under 30 seconds", "Automated pricing formula engine", "Granular RBAC & audit logging" }),
                LiveUrl = "",
                DisplayOrder = 2,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "eurobank",
                Title = "Eurobank Banking Portal",
                Category = "Secure Banking & Customer Portal",
                FilterCategory = "dotnet",
                Image = "assets/img/Eurobank.png",
                Gif = "assets/img/EUROBank.gif",
                Description = "High-security banking customer portal engineered with enterprise authentication, role-based authorization, and resilient account workflows.",
                Problem = "Required a secure digital banking customer portal with high concurrency handling, OAuth2/JWT security boundaries, and reliable audit records.",
                Architecture = "Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security barriers.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "ASP.NET Core", "C#", "Security / RBAC", "SQL Server", "Microservices" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Enterprise OAuth2/JWT Security", "High Concurrency Resilience", "Role-Based Access Control" }),
                LiveUrl = "",
                DisplayOrder = 3,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "cloudoor",
                Title = "Cloudoor Cloud SaaS",
                Category = "Cloud SaaS & Multi-Tenant Infrastructure",
                FilterCategory = "saas",
                Image = "assets/img/Cloudoor.png",
                Gif = "assets/img/CloudoorG.gif",
                Description = "Scalable multi-tenant cloud automation platform supporting US-based clients with resource monitoring and automated cloud orchestration.",
                Problem = "Rising cloud overhead and lack of unified multi-tenant automation across Azure resources for fast-growing US technology clients.",
                Architecture = "Architected containerized microservices in Docker on Azure, integrating automated resource rightsizing rules and automated billing pipelines.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "Azure Cloud", ".NET Core", "Docker", "Angular", "Microservices" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "25% Cloud Cost Reduction", "Multi-Tenant Data Isolation", "Automated CI/CD Pipelines" }),
                LiveUrl = "",
                DisplayOrder = 4,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "medikea",
                Title = "Medikea Healthcare Platform",
                Category = "HealthTech & Telemedicine System",
                FilterCategory = "health",
                Image = "assets/img/Medikea.png",
                Gif = "assets/img/Medikea.gif",
                Description = "Telemedicine and health portal streamlining patient appointments, remote consultations, and digital health records.",
                Problem = "Healthcare providers lacked a unified digital portal to manage patient appointments, video consultations, and real-time electronic records.",
                Architecture = "Engineered a secure React and Node.js platform with PostgreSQL and WebSockets for encrypted doctor-patient interactions and appointment queues.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "React", "Node.js", "PostgreSQL", "Cloud Infrastructure", "WebSockets" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Health-grade technical safeguards", "Encrypted doctor-patient messaging", "WebSockets consultation queues" }),
                LiveUrl = "",
                DisplayOrder = 5,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "linkcenter",
                Title = "LinksCenter Portal",
                Category = "High-Traffic Web & Directory System",
                FilterCategory = "web",
                Image = "assets/img/linkcenter2.png",
                Gif = "assets/img/LinksWeb.gif",
                Description = "High-volume link curation and discovery portal optimized with .NET Core and distributed Redis caching to sustain high concurrency traffic spikes.",
                Problem = "High concurrency traffic spikes caused slow database queries, impacting SEO rankings and user retention metrics.",
                Architecture = "Refactored backend data access in .NET Core with Redis distributed caching layer and Cloudflare edge CDN, lowering page loads by 40%.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { ".NET Core", "SQL Server", "Redis Caching", "Bootstrap 5", "Cloudflare" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Distributed Redis caching layer", "High-concurrency query optimization", "40% response time improvement" }),
                LiveUrl = "",
                DisplayOrder = 6,
                IsFeatured = true,
                IsPublished = true
            }
        };

        foreach (var p in projects)
        {
            var existing = await context.Projects.FirstOrDefaultAsync(x => x.Slug == p.Slug);
            if (existing == null)
            {
                await context.Projects.AddAsync(p);
            }
            else
            {
                existing.Title = p.Title;
                existing.Category = p.Category;
                existing.FilterCategory = p.FilterCategory;
                existing.Description = p.Description;
                existing.Problem = p.Problem;
                existing.Architecture = p.Architecture;
                existing.TechnologiesJson = p.TechnologiesJson;
                existing.HighlightsJson = p.HighlightsJson;
                existing.LiveUrl = p.LiveUrl;
                existing.DisplayOrder = p.DisplayOrder;
            }
        }

        await context.SaveChangesAsync();
    }
}
