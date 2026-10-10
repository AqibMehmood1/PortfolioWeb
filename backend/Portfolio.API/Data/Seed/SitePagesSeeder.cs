using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class SitePagesSeeder
{
    private static readonly string ValueCardsJson = @"[
  {""title"":""Task Automation"",""description"":""DevOps and backend architecture screened for proven technical capability, eliminating repetitive manual operations.""},
  {""title"":""Agentic Workflows"",""description"":""Speeds up execution by connecting systems and streamlining processes across different tools and multi-agent LLM pipelines.""},
  {""title"":""Cost Efficiency"",""description"":""Lowers operational costs by minimizing manual effort and optimizing compute, caching, and serverless resource utilization.""},
  {""title"":""Resource Efficiency"",""description"":""Optimizes the use of people, time, and systems by ensuring architecture tasks are handled intelligently with minimal waste.""}
]";

    private static readonly string ProcessStepsJson = @"[
  {""title"":""Tell Us What You Need"",""description"":""One quick conversation. Tell us about your team, tech stack, and goals."",""badge"":""01""},
  {""title"":""Build Your Match Within 24 Hours"",""description"":""We match AI developers to your stack and workflow. You review them."",""badge"":""02""},
  {""title"":""Start Shipping Immediately"",""description"":""Your engineer is embedded, onboarded and contributing."",""badge"":""03""}
]";

    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var existingPages = await context.SitePages.Include(p => p.Sections).ToListAsync();

        var defaultPages = new List<(string Slug, string Title, string NavTitle, int Order, List<(string Key, string Title, string? Subtitle, string? Description, string? ContentJson, int SectionOrder)> Sections)>
        {
            ("", "Home", "Home", 1, new()
            {
                ("hero", "Architect High-Scale SaaS & AI Systems", "Specialized Solutions Architecture", "Specialized Solutions Architect & Technology Partner helping Startups, SMBs, and Enterprises build, scale, and ship high-performance software with 9+ years of proven delivery across the US, Canada, and Europe.", null, 1),
                ("value", "How Solutions Architecture Delivers Value To Your Business", "Value Proposition", "Aligning business strategy, technical execution, and cloud economics into software products built to scale.", ValueCardsJson, 2),
                ("services", "Explore Our Architecture Pillars", "Full-Lifecycle Delivery", "Comprehensive solutions across modern SaaS systems, autonomous AI workflows, and enterprise cloud migrations.", null, 3),
                ("tech-matrix", "Yes. We Have Expertise For Every Stack.", "Engineers For Every Stack", "9+ years of hands-on expertise across leading enterprise frameworks, cloud ecosystems & AI pipelines.", null, 4),
                ("industries", "Proven Solutions Across Core Industries", "Industry Domain Mastery", "Deep domain expertise applied to high-stakes industries where compliance, security, and uptime are mission-critical.", null, 5),
                ("case-studies", "Featured Production Architectures & Case Studies", "Delivered Systems", "Real-world production platforms, automated estimation engines, and enterprise web portals designed and delivered for international clients.", null, 6),
                ("process", "Three Steps. That's All It Takes.", "Simple Process. Serious Results.", "Tell us what you need, match within 24 hours, and start shipping immediately with zero overhead.", ProcessStepsJson, 7),
                ("testimonials", "Trusted by International Technology Teams", "Client Endorsements", "Real feedback from founders and engineering leaders across the US and Europe.", null, 8),
                ("contact-hub", "Schedule an Architectural Consultation", "Book Strategy Call", "Whether you're scoping a new SaaS product, integrating autonomous AI agents, or modernizing legacy infrastructure, let's map out the right strategy.", null, 9)
            }),
            ("services", "Services & Pillars", "Services", 2, new()
            {
                ("services-hero", "End-to-End Enterprise Architecture & Advisory", "Architecture Offerings", "From zero-to-one startup MVPs to scaling enterprise microservices and multi-tenant cloud systems across the US and Europe.", null, 1),
                ("services-grid", "Core Solutions Architecture Capabilities", "Pillar Offerings", "Deep architectural deep-dives across SaaS multi-tenancy, AI agents, cloud migrations, and modern web portals.", null, 2),
                ("accordion", "Interactive Capability Pillars", "Deep-Dive Capabilities", "Explore our technical execution approach and deliverables for each primary architectural discipline.", null, 3),
                ("engagement", "Engagement Models Built For Speed & Scale", "Flexible Partnership", "Choose between Fractional Solutions Architect advisory, project-based delivery sprints, or full engineering team leadership.", ValueCardsJson, 4),
                ("services-cta", "Need an Architectural Review of Your System?", "Architecture Advisory", "Let's review your codebase, identify scalability bottlenecks, and design a modern roadmap that drives business outcomes.", null, 5)
            }),
            ("expertise", "Technical Radar & Stacks", "Expertise", 3, new()
            {
                ("expertise-hero", "Architectural Disciplines & Tech Radar", "Technical Competencies", "Comprehensive architectural mastery across distributed cloud systems, autonomous AI agents, enterprise .NET, modern web SPAs, and high-throughput data layers.", null, 1),
                ("radar", "Categorized Technology Radar & Stack Matrix", "Core Stacks", "Hands-on expertise across leading enterprise frameworks, cloud ecosystems & AI pipelines with live proficiency filtering.", null, 2),
                ("certifications", "Verified Industry Badges & Endorsements", "Validated Skills", "Certified engineering proficiencies and validated stakeholder testimonials from US and European founders.", null, 3),
                ("expertise-cta", "Need Guidance on Your Tech Stack?", "Technical Architecture", "Let's review your product roadmap, compare architectural trade-offs (.NET vs Node vs Python, Azure vs AWS), and design the right system.", null, 4)
            }),
            ("projects", "Portfolio & Case Studies", "Portfolio", 4, new()
            {
                ("projects-hero", "Case Studies & Delivered Systems", "Portfolio Showcase", "Real-world production platforms, automated estimation engines, and enterprise web portals designed and delivered for international clients.", null, 1),
                ("filters", "Category Filters Toolbar", "Filter Stacks", "Filter case studies by SaaS & Cloud, Enterprise .NET & CPQ, Web Platforms, and HealthTech.", null, 2),
                ("projects-grid", "Production Case Studies Grid", "Delivered Platforms", "Explore live platform links, architectural highlights, and problem statements for delivered production systems.", null, 3),
                ("projects-cta", "Have a Project Requiring High-Scale Architecture?", "Next Steps", "I can help you evaluate technical feasibility, blueprint the system architecture, and guide your engineering team to delivery.", null, 4)
            }),
            ("about", "About NEXVOYS", "About", 5, new()
            {
                ("about-hero", "Architectural Philosophy & Strategy", "About & Leadership", "Enterprise Solutions Architect & Technology Partner helping Startups, SMBs, and Enterprises architect scalable SaaS products, autonomous AI agents, and high-performance cloud applications.", null, 1),
                ("vision", "Technology Decisions Must Directly Drive Revenue & Velocity", "Engineering Vision", "With 9+ years of international software delivery across the US, Canada, and Europe, I partner with founders, CEOs, and CTOs to design secure, scalable, and high-performance software.", null, 2),
                ("focus-areas", "Core Architectural Focus & Competencies", "Target Focus Areas", "Designing multi-tenant SaaS foundations with clean data isolation from day one, refactoring legacy monolithic .NET systems into modular microservices, and integrating autonomous AI pipelines.", null, 3),
                ("execution", "Engineering Modernization Blueprint", "Execution Strategy", "Zero-lock-in modularity, sub-second performance, zero-trust security, and cost-aware scalability.", ValueCardsJson, 4),
                ("milestones", "Career Milestones & Leadership Journey", "Work History", "Over 9 years of progression from Full-Stack Software Engineer to Lead Solutions Architect and Fractional CTO.", null, 5),
                ("credentials", "Verified Academic Degrees & Certifications", "Credentials", "BS in Computer Science and industry-recognized certifications across Microsoft Azure, AWS, and enterprise software architecture.", ProcessStepsJson, 6)
            }),
            ("contact", "Consultation & Contact", "Contact Us", 6, new()
            {
                ("contact-hero", "Schedule an Architectural Consultation", "Let's Collaborate", "Whether you're scoping a new SaaS product, integrating autonomous AI agents, or modernizing legacy infrastructure, let's map out the right strategy.", null, 1),
                ("contact-form", "Request Architecture Session", "Book Strategy Call", "Select your primary objective so I can prepare relevant case studies and technical options.", null, 2),
                ("contact-channels", "Direct Communication Channels", "Global Reach", "Direct email, phone, WhatsApp, and location details for seamless international collaboration.", null, 3)
            })
        };

        foreach (var def in defaultPages)
        {
            var page = existingPages.FirstOrDefault(p => p.Slug.ToLower() == def.Slug.ToLower());
            if (page == null)
            {
                page = new SitePage
                {
                    Slug = def.Slug,
                    Title = def.Title,
                    NavTitle = def.NavTitle,
                    IsVisible = true,
                    ShowInNav = true,
                    ShowInFooter = true,
                    IsSystem = true,
                    DisplayOrder = def.Order,
                    MetaTitle = $"{def.Title} | NEXVOYS Enterprise Architecture",
                    MetaDescription = $"Manage and explore {def.Title} on NEXVOYS Enterprise Technology Partner platform.",
                    CreatedAt = DateTime.UtcNow
                };

                await context.SitePages.AddAsync(page);
                await context.SaveChangesAsync();
                existingPages.Add(page);
                logger.LogInformation("Seeded SitePage: '{Title}' ({Slug})", def.Title, def.Slug);
            }
            else
            {
                if (page.DisplayOrder != def.Order)
                {
                    page.DisplayOrder = def.Order;
                }
            }

            // Ensure sections exist and update content
            foreach (var sDef in def.Sections)
            {
                var sec = page.Sections.FirstOrDefault(s => s.SectionKey.ToLower() == sDef.Key.ToLower());
                if (sec == null)
                {
                    sec = new SiteSection
                    {
                        PageId = page.Id,
                        SectionKey = sDef.Key,
                        Title = sDef.Title,
                        Subtitle = sDef.Subtitle,
                        Description = sDef.Description,
                        ContentJson = sDef.ContentJson,
                        SectionType = "built-in",
                        IsVisible = true,
                        IsSystem = true,
                        DisplayOrder = sDef.SectionOrder,
                        CreatedAt = DateTime.UtcNow
                    };

                    await context.SiteSections.AddAsync(sec);
                    page.Sections.Add(sec);
                    logger.LogInformation("Seeded SiteSection '{Key}' for Page '{Page}'", sDef.Key, def.Title);
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(sec.Description) || sec.Title.EndsWith("Header") || sec.Title.EndsWith("Intro") || sec.Title.EndsWith("Grid"))
                    {
                        sec.Title = sDef.Title;
                        sec.Subtitle = sDef.Subtitle;
                        sec.Description = sDef.Description;
                    }
                    if (string.IsNullOrWhiteSpace(sec.ContentJson) && !string.IsNullOrWhiteSpace(sDef.ContentJson))
                    {
                        sec.ContentJson = sDef.ContentJson;
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
