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
                HighlightsJson = JsonSerializer.Serialize(new[] { "Sub-second latency", "Modern UX Architecture", "Responsive Multi-Device Support" }),
                LiveUrl = "https://scrole.com",
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
                Description = "Custom quotation engine and dynamic cost estimation platform engineered for Odyssey Design San Antonio client workflows.",
                Problem = "Sales teams spent over 3 hours daily on manual spreadsheet quotation calculations, resulting in calculation inconsistencies and deal latency.",
                Architecture = "Developed an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with granular role-based permissions.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { ".NET Core", "C#", "SQL Server", "Angular", "Azure App Services" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Automated 3hr daily manual quoting", "Real-time price calculation", "Enterprise Role Permissions" }),
                LiveUrl = "https://quote.odysseydesignco.com/home",
                DisplayOrder = 2,
                IsFeatured = true,
                IsPublished = true
            },
            new()
            {
                Slug = "eurobank",
                Title = "Eurobank Banking Portal",
                Category = "Fintech & Secure Banking Platform",
                FilterCategory = "dotnet",
                Image = "assets/img/Eurobank.png",
                Gif = "assets/img/EUROBank.gif",
                Description = "Secure, high-availability banking portal engineered with enterprise authentication, strict compliance, and reliable account workflows.",
                Problem = "Required a bulletproof, compliant digital banking customer portal with high concurrency handling and strict zero-trust security standards.",
                Architecture = "Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security barriers.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "ASP.NET Core", "C#", "Security / RBAC", "SQL Server", "Microservices" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "Enterprise Security Architecture", "High Concurrency", "Zero-Downtime Resilience" }),
                LiveUrl = "https://ssp.eurobank.com.cy/account/login",
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
                HighlightsJson = JsonSerializer.Serialize(new[] { "25% Cloud Cost Reduction", "Multi-Tenant Isolation", "Automated CI/CD Pipelines" }),
                LiveUrl = "https://cloudoor.com",
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
                Description = "Comprehensive telemedicine and health portal streamlining patient appointments, consultations, and digital health records.",
                Problem = "Healthcare providers lacked a unified digital portal to manage patient appointments, video consultations, and real-time electronic records.",
                Architecture = "Engineered a secure React and Node.js platform with PostgreSQL and WebSockets for encrypted doctor-patient interactions and appointment queues.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { "React", "Node.js", "PostgreSQL", "Cloud Infrastructure", "WebSockets" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "HIPAA-compliant principles", "Real-time messaging", "High scalability" }),
                LiveUrl = "https://www.medikea.co.tz",
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
                Description = "High-volume link curation and discovery portal optimized for sub-second query speeds, SEO indexing, and high concurrent user loads.",
                Problem = "High concurrency traffic spikes caused slow database queries, impacting SEO rankings and user retention metrics.",
                Architecture = "Refactored backend data access in .NET Core with Redis distributed caching layer and Cloudflare edge CDN, lowering page loads by 40%.",
                TechnologiesJson = JsonSerializer.Serialize(new[] { ".NET Core", "SQL Server", "Redis Caching", "Bootstrap 5", "Cloudflare" }),
                HighlightsJson = JsonSerializer.Serialize(new[] { "40% Page Load Improvement", "Redis Distributed Caching", "High Concurrency Throughput" }),
                LiveUrl = "http://www.links.center",
                DisplayOrder = 6,
                IsFeatured = true,
                IsPublished = true
            }
        };

        foreach (var p in projects)
        {
            if (!await context.Projects.AnyAsync(x => x.Slug == p.Slug))
            {
                await context.Projects.AddAsync(p);
            }
        }

        await context.SaveChangesAsync();
    }
}
