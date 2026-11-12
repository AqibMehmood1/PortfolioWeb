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
                Title = "NEXVOYS — Enterprise Software Architecture, Cloud & AI Engineering Studio",
                Description = "Nexvoys is an enterprise software architecture and cloud engineering studio helping technology companies build scalable SaaS platforms, modern .NET microservices, and autonomous AI systems.",
                Keywords = "Enterprise Solutions Architecture, SaaS Architecture, AI Agents, .NET 9, Cloud Cost Optimization, Azure, Multi-Tenancy, Software Engineering Studio",
                OgTitle = "NEXVOYS — Enterprise Software Architecture, Cloud & AI Engineering Studio",
                OgDescription = "Enterprise architecture and engineering partner for high-scale SaaS and AI platforms worldwide.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/about",
                Title = "About NEXVOYS | Enterprise Software Architecture Studio",
                Description = "Nexvoys is an enterprise software architecture studio delivering mission-critical SaaS platforms, cloud infrastructure, and AI engineering for international tech companies.",
                Keywords = "Software Architecture Studio, Enterprise Solutions Architecture, Cloud Engineering, .NET Azure AI Systems",
                OgTitle = "About NEXVOYS | Enterprise Architecture Studio",
                OgDescription = "Engineering philosophy, institutional operating standards, and verified production delivery record.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/services",
                Title = "Services & Solutions Architecture | Nexvoys",
                Description = "SaaS Product Architecture, AI Agents & Automation, Cloud Cost Optimization, .NET Modernization, Fractional CTO.",
                Keywords = "SaaS Product Architecture, AI Agents, Cloud Cost Optimization, .NET Modernization, Fractional CTO",
                OgTitle = "Architectural Services & Pillars | Nexvoys",
                OgDescription = "Explore the 5 core architectural service pillars and transparent engagement models.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/projects",
                Title = "Case Studies & Selected Work | Nexvoys",
                Description = "Production case studies including ODTool CPQ calculation engine, Cloudoor multi-tenant SaaS, and secure financial portals.",
                Keywords = "Portfolio, Case Studies, Delivered Systems, CPQ Engine, SaaS Architecture, Cloud Optimization",
                OgTitle = "Case Studies & Selected Work | Nexvoys",
                OgDescription = "Real-world production architectures delivered for international clients.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/expertise",
                Title = "Technical Radar & Architecture Disciplines | Nexvoys",
                Description = "Core specialist stack: .NET 9, C#, Microsoft Azure, AWS, Angular, React, Redis, and LangChain/Semantic Kernel AI pipelines.",
                Keywords = "Tech Radar, .NET 9, C#, Microsoft Azure, Angular, Redis, LangChain, Semantic Kernel",
                OgTitle = "Technical Radar & Disciplines | Nexvoys",
                OgDescription = "Core technical competencies and specialist architecture stack.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/contact",
                Title = "Book an Architecture Call | Nexvoys",
                Description = "Book a 30-minute architecture strategy call directly with the principal architect. NDA on request.",
                Keywords = "Book Architecture Call, Schedule Consultation, Solutions Architect, Architecture Audit",
                OgTitle = "Book an Architecture Call | Nexvoys",
                OgDescription = "Connect directly with our principal solutions architect to evaluate your technical roadmap.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            }
        };

        foreach (var s in seoList)
        {
            var existing = await context.SeoMetadata.FirstOrDefaultAsync(x => x.PageRoute == s.PageRoute);
            if (existing == null)
            {
                await context.SeoMetadata.AddAsync(s);
            }
            else
            {
                existing.Title = s.Title;
                existing.Description = s.Description;
                existing.Keywords = s.Keywords;
                existing.OgTitle = s.OgTitle;
                existing.OgDescription = s.OgDescription;
            }
        }

        await context.SaveChangesAsync();
    }
}
