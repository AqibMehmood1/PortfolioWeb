using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class SeoSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var seoList = new List<SeoMetadata>
        {
            new()
            {
                PageRoute = "/",
                Title = "NEXVOYS | Enterprise Technology Partner | SaaS & AI Systems",
                Description = "Helping Startups, SMBs, and Enterprises architect scalable SaaS products, autonomous AI agents, and high-performance cloud applications with 9+ years of delivery.",
                Keywords = "Solutions Architect, SaaS Architecture, AI Agents, .NET 9, Cloud Optimization, Azure, Multi-Tenancy",
                OgTitle = "NEXVOYS | Enterprise Technology Partner",
                OgDescription = "Architecting scalable SaaS products, autonomous AI agents, and high-performance cloud applications.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/about",
                Title = "About NEXVOYS | Technology Partner & Solutions Architecture",
                Description = "9+ years of international software delivery across the US, Canada, and Europe, designing secure, scalable, and high-performance software systems.",
                Keywords = "Software Architecture, Solutions Architect, Engineering Vision, Enterprise Track Record",
                OgTitle = "About NEXVOYS | Technology Partner",
                OgDescription = "Engineering philosophy, verified career journey, and architecture framework.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/services",
                Title = "Services & Solutions Architecture | NEXVOYS",
                Description = "Multi-Tenant SaaS, Autonomous AI Agents, Cloud Migration & Cost Optimization, Legacy .NET Modernization, Fractional CTO.",
                Keywords = "SaaS Multi-Tenancy, Autonomous AI Agents, Cloud Cost Optimization, .NET Modernization, Fractional Architect",
                OgTitle = "Architectural Services | NEXVOYS",
                OgDescription = "Explore the 5 core architectural service pillars and engagement models.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/projects",
                Title = "Case Studies & Delivered Systems | NEXVOYS",
                Description = "Explore production case studies including Scrole, ODTool Quotation Engine, Eurobank Banking Portal, Cloudoor Cloud SaaS, and Medikea.",
                Keywords = "Portfolio, Case Studies, Delivered Systems, CPQ Engine, Banking Portal, Cloud SaaS",
                OgTitle = "Case Studies & Delivered Systems | NEXVOYS",
                OgDescription = "Real-world production platforms and architecture blueprints delivered for global clients.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/expertise",
                Title = "Technical Radar & Architecture Disciplines | NEXVOYS",
                Description = "Comprehensive technical mastery across AI/ML, Frontend, Backend, Databases, DevOps, and Mobile stacks.",
                Keywords = "Tech Radar, AI, .NET 9, Angular, React, Azure, AWS, SQL Server, Redis, Kubernetes",
                OgTitle = "Technical Radar & Disciplines | NEXVOYS",
                OgDescription = "Explore hands-on expertise across leading enterprise frameworks and cloud stacks.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/contact",
                Title = "Schedule Architectural Consultation | NEXVOYS",
                Description = "Schedule a consultation for SaaS Architecture, AI Agents, Cloud Optimization, or Fractional CTO advisory.",
                Keywords = "Contact Solutions Architect, Schedule Consultation, Tech Advisory, Architecture Audit",
                OgTitle = "Schedule Consultation | NEXVOYS",
                OgDescription = "Connect directly with our solutions architecture leadership to discuss your roadmap.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            }
        };

        foreach (var s in seoList)
        {
            if (!await context.SeoMetadata.AnyAsync(x => x.PageRoute == s.PageRoute))
            {
                await context.SeoMetadata.AddAsync(s);
            }
        }

        await context.SaveChangesAsync();
    }
}
