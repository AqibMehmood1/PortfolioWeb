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
                Title = "Nexvoys — SaaS & AI Architecture Partner for Startups and SMBs",
                Description = "Founder-led architecture and engineering for SaaS and AI products. .NET, Azure and AI agents. Serving the US, Canada, Singapore and Cyprus.",
                Keywords = "Solutions Architect, SaaS Architecture, AI Agents, .NET 9, Cloud Cost Optimization, Azure, Multi-Tenancy, Fractional CTO",
                OgTitle = "Nexvoys — Senior Architecture for SaaS & AI Products",
                OgDescription = "Founder-led architecture partner for startups and SMBs in the US, Canada, Singapore and Cyprus.",
                OgImage = "assets/nexvoys/black-logo.png",
                Robots = "index, follow"
            },
            new()
            {
                PageRoute = "/about",
                Title = "About Nexvoys | Founder-Led Architecture Partner",
                Description = "Led by principal solutions architect Bilal with 9+ years shipping .NET, Azure, and AI systems for companies in the US, Europe, and Asia.",
                Keywords = "Software Architecture, Solutions Architect, Founder-Led Engineering, .NET Azure AI Track Record",
                OgTitle = "About Nexvoys | Senior Architecture Partner",
                OgDescription = "Founder-led engineering philosophy and verified production delivery record.",
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
