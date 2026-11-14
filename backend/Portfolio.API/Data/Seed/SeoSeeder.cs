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
                Description = "Nexvoys is an enterprise software architecture and cloud engineering studio helping technology companies build scalable SaaS platforms, modern microservices, and autonomous AI systems.",
                Keywords = "Enterprise Solutions Architecture, SaaS Architecture, AI Agents, Cloud Cost Optimization, Azure, AWS, Multi-Tenancy, Software Engineering Studio",
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
                Keywords = "Software Architecture Studio, Enterprise Solutions Architecture, Cloud Engineering, Cloud & AI Systems",
                OgTitle = "About NEXVOYS | Enterprise Architecture Studio",
                OgDescription = "Engineering philosophy, institutional operating standards, and verified production delivery record.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/services",
                Title = "Services & Solutions Architecture | Nexvoys",
                Description = "SaaS Product Architecture, AI Agents & Automation, Cloud Cost Optimization, Legacy Modernization, Fractional CTO.",
                Keywords = "SaaS Product Architecture, AI Agents, Cloud Cost Optimization, Legacy Modernization, Fractional CTO",
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
                Description = "Core specialist capabilities: Multi-cloud architecture (Azure/AWS), distributed microservices, modern frontends, and AI agent pipelines.",
                Keywords = "Tech Radar, Cloud Architecture, Microsoft Azure, AWS, Angular, React, Redis, LangChain, AI Agents",
                OgTitle = "Technical Radar & Disciplines | Nexvoys",
                OgDescription = "Core technical competencies and specialist architecture stack.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/contact",
                Title = "Schedule a Project Consultation | Nexvoys",
                Description = "Book a 30-minute discovery strategy call directly with our senior software engineering team. NDA on request.",
                Keywords = "Schedule Discovery Call, Software Development Consultation, Senior Software Engineers, Code Audit",
                OgTitle = "Schedule a Project Consultation | Nexvoys",
                OgDescription = "Connect directly with our senior engineering team to evaluate your project scope and technical roadmap.",
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
