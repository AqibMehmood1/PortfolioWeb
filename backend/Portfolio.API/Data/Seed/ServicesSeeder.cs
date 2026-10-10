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
                Title = "SaaS Product Architecture",
                ShortDesc = "Multi-tenant foundations, tenant data isolation, subscription billing, and elastic cloud scaling.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Multi-Tenant Database Schema Partitioning",
                    "Stripe & Subscription Billing Workflows",
                    "Elastic Cloud Auto-Scaling & CDN Edge",
                    "Granular RBAC Security & Audit Logs"
                }),
                Image = "assets/img/Cloudoor.png",
                Route = "/services",
                DisplayOrder = 1,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//02",
                Title = "AI Agents & Automation",
                ShortDesc = "Autonomous LLM tool-calling agents, enterprise RAG vector retrieval, and intelligent workflow pipelines.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Autonomous Task & Reasoning Agents",
                    "Enterprise RAG with Vector Databases",
                    "LangChain & Semantic Kernel Pipelines",
                    "Document Parsing & Automated Data Workflows"
                }),
                Image = "assets/img/ODTool.png",
                Route = "/services",
                DisplayOrder = 2,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//03",
                Title = "Cloud Cost Optimization",
                ShortDesc = "Infrastructure audits, containerization, and workload rightsizing that cut operating costs by up to 25%.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Up to 25% Cloud Cost Reduction",
                    "Azure & AWS Compute Rightsizing",
                    "Docker Containerization & Kubernetes",
                    "Distributed In-Memory Redis Caching"
                }),
                Image = "assets/img/Cloudoor.png",
                Route = "/services",
                DisplayOrder = 3,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//04",
                Title = ".NET Modernization",
                ShortDesc = "Upgrading monolithic legacy .NET Framework applications into high-throughput .NET 9 microservices and reactive SPAs.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Monolith to Microservices Roadmap",
                    "Legacy .NET Framework to .NET 9 Upgrade",
                    "Sub-Second Response Time Optimization",
                    "High-Throughput WebAPI & gRPC Contracts"
                }),
                Image = "assets/img/Eurobank.png",
                Route = "/services",
                DisplayOrder = 4,
                IsPublished = true
            },
            new()
            {
                IndexTag = "//05",
                Title = "Fractional CTO & Advisory",
                ShortDesc = "Senior technical leadership for startups and SMBs preparing to raise, scale, or hire engineering teams.",
                BulletsJson = JsonSerializer.Serialize(new[]
                {
                    "Technical Due Diligence & Roadmap",
                    "Engineering Hiring & Code Review Standards",
                    "Tech Stack Evaluation (.NET, Azure, Node)",
                    "Executive & Board Technical Advisory"
                }),
                Image = "assets/img/ODTool.png",
                Route = "/services",
                DisplayOrder = 5,
                IsPublished = true
            }
        };

        foreach (var item in accordionItems)
        {
            var existing = await context.AccordionServices.FirstOrDefaultAsync(a => a.IndexTag == item.IndexTag);
            if (existing == null)
            {
                await context.AccordionServices.AddAsync(item);
            }
            else
            {
                existing.Title = item.Title;
                existing.ShortDesc = item.ShortDesc;
                existing.BulletsJson = item.BulletsJson;
                existing.Image = item.Image;
                existing.Route = item.Route;
                existing.DisplayOrder = item.DisplayOrder;
            }
        }

        await context.SaveChangesAsync();
    }
}
