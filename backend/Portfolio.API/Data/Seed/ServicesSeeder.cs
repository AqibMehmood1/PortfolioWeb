using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class ServicesSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var services = new List<Service>
        {
            new()
            {
                Slug = "saas",
                Icon = "fas fa-cubes",
                Title = "SaaS Architecture & Multi-Tenancy",
                ShortDescription = "Design and build scalable multi-tenant SaaS foundations with clean tenant isolation, subscription billing, and 99.9% uptime.",
                FullDescription = "Architecting end-to-end SaaS solutions that scale efficiently from prototype to millions of users. I design robust data isolation models, automated provisioning, subscription tiers, and elastic cloud scaling.",
                DeliverablesJson = JsonSerializer.Serialize(new[]
                {
                    "Multi-tenant database schema partitioning",
                    "Stripe / Subscription billing automation",
                    "Zero-downtime auto-scaling infrastructure",
                    "Granular RBAC security & audit logging"
                }),
                EngagementTopic = "SaaS Architecture & Scale",
                DisplayOrder = 1,
                IsPublished = true
            },
            new()
            {
                Slug = "ai",
                Icon = "fas fa-robot",
                Title = "Autonomous AI Agents & GenAI",
                ShortDescription = "Integrate practical AI agents, LangChain/Semantic Kernel pipelines, and intelligent workflow automations.",
                FullDescription = "Empower your software with generative AI capabilities and autonomous agents. We build production-ready RAG architectures, custom LLM tool-calling agents, and intelligent automated workflows.",
                DeliverablesJson = JsonSerializer.Serialize(new[]
                {
                    "Autonomous task & reasoning agents",
                    "Enterprise RAG pipelines with vector databases",
                    "Document parsing & AI data extraction",
                    "Custom LangChain & Semantic Kernel integration"
                }),
                EngagementTopic = "AI Agents & Workflow Automation",
                DisplayOrder = 2,
                IsPublished = true
            },
            new()
            {
                Slug = "cloud",
                Icon = "fas fa-cloud",
                Title = "Cloud Migration & Cost Optimization",
                ShortDescription = "Architect zero-downtime Azure and AWS migrations, serverless workflows, and infrastructure tuning that cut costs up to 25%.",
                FullDescription = "Eliminate bloated cloud bills and fragile infrastructure. I audit your Azure/AWS setups, rightsize compute/storage, implement distributed caching, and automate CI/CD release pipelines.",
                DeliverablesJson = JsonSerializer.Serialize(new[]
                {
                    "Zero-downtime database & app migration",
                    "Cloud infrastructure audit & 25% cost reduction",
                    "Kubernetes / Docker container orchestration",
                    "Automated CI/CD deployment pipelines"
                }),
                EngagementTopic = "Cloud Migration & Cost Optimization",
                DisplayOrder = 3,
                IsPublished = true
            },
            new()
            {
                Slug = "legacy",
                Icon = "fas fa-sync-alt",
                Title = "Legacy .NET & Web Modernization",
                ShortDescription = "Refactor monolithic, sluggish legacy .NET applications into high-performance .NET 9 microservices and reactive SPAs.",
                FullDescription = "Transform legacy technical debt into high-performance assets. We upgrade legacy ASP.NET WebForms/MVC to .NET 9 Core, decouple monolithic codebases into microservices, and build modern Angular/React user experiences.",
                DeliverablesJson = JsonSerializer.Serialize(new[]
                {
                    "Monolith to microservices architectural roadmap",
                    "Upgrading legacy .NET Framework to .NET 9",
                    "40%+ page load & API throughput optimization",
                    "RESTful & gRPC high-speed API design"
                }),
                EngagementTopic = "Legacy .NET & Web Modernization",
                DisplayOrder = 4,
                IsPublished = true
            },
            new()
            {
                Slug = "advisory",
                Icon = "fas fa-user-tie",
                Title = "Fractional CTO & Architecture Advisory",
                ShortDescription = "Senior technical leadership on a fractional basis for startups preparing to raise capital, hire developers, or scale.",
                FullDescription = "Get executive-level technical leadership without the overhead of a full-time executive. I assist founders with technical due diligence, tech stack selection, code reviews, and agile engineering leadership.",
                DeliverablesJson = JsonSerializer.Serialize(new[]
                {
                    "Technical due diligence & architecture roadmap",
                    "Engineering team hiring & code review standards",
                    "Vendor evaluation & tech stack selection",
                    "Executive & board technical advisory"
                }),
                EngagementTopic = "Fractional Solutions Architect",
                DisplayOrder = 5,
                IsPublished = true
            }
        };

        foreach (var s in services)
        {
            if (!await context.Services.AnyAsync(x => x.Slug == s.Slug))
            {
                await context.Services.AddAsync(s);
            }
        }

        var accordionItems = new List<AccordionServiceItem>
        {
            new()
            {
                IndexTag = "//01",
                Title = "AI & Data Innovation",
                ShortDesc = "Build Intelligent Products Using AI, Machine Learning, And Advanced Data Engineering.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Agent As a Service",
                    "AI Product Development",
                    "Autonomous Agentic AI",
                    "Enterprise RAG & Vector DBs"
                }),
                Image = "assets/img/project-3.jpg",
                Route = "/expertise",
                DisplayOrder = 1,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//02",
                Title = "Custom Software Development",
                ShortDesc = "End-to-End Scalable Architectures Tailored for Startup MVPs & High-Growth SaaS Platforms.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Multi-Tenant SaaS Platforms",
                    "Automated Stripe Billing",
                    "Dynamic Subdomain Routers",
                    "Clean RBAC Data Isolation"
                }),
                Image = "assets/img/project-1.jpg",
                Route = "/services",
                DisplayOrder = 2,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//03",
                Title = "Enterprise .NET & CPQ Engines",
                ShortDesc = "Modern High-Throughput C# / .NET 9 WebAPIs, Microservices, and Dynamic Pricing Systems.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    ".NET 9 & ASP.NET WebAPI",
                    "Dynamic CPQ Price Calculation",
                    "Asynchronous Event-Bus",
                    "Monolith to Microservices Modernization"
                }),
                Image = "assets/img/project-2.jpg",
                Route = "/services",
                DisplayOrder = 3,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//04",
                Title = "Cloud Scaling & Cost Optimization",
                ShortDesc = "Resilient Azure & AWS Cloud Infrastructure Engineered to Cut Operating Bills by up to 25%.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "25% Cloud Cost Reduction",
                    "Kubernetes & Docker Clusters",
                    "Zero-Downtime Blue/Green CI/CD",
                    "Distributed In-Memory Redis Caching"
                }),
                Image = "assets/img/project-4.jpg",
                Route = "/expertise",
                DisplayOrder = 4,
                IsPublished = true
            }
        };

        foreach (var item in accordionItems)
        {
            if (!await context.AccordionServices.AnyAsync(a => a.IndexTag == item.IndexTag))
            {
                await context.AccordionServices.AddAsync(item);
            }
        }

        await context.SaveChangesAsync();
    }
}
