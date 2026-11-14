using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class SitePagesSeeder
{
    private static readonly string ValueCardsJson = @"[
  {""title"":""Direct Senior Engineering"",""description"":""Our clients collaborate directly with senior enterprise architects and technical leads — zero agency bureaucracy, no account managers, and no junior hand-offs.""},
  {""title"":""100% Code & IP Ownership"",""description"":""You own every line of code, deployment script, and architecture diagram. Zero proprietary vendor lock-in.""},
  {""title"":""Cloud Cost Discipline"",""description"":""We design cloud systems to be lean by default, rightsizing compute resources and cutting wasteful infrastructure overhead.""},
  {""title"":""Time-Zone Alignment"",""description"":""Dedicated overlap hours for US Eastern and Pacific, plus same-day working overlap with Singapore, Cyprus, and Europe.""}
]";

    private static readonly string ProcessStepsJson = @"[
  {""title"":""Discovery Call"",""description"":""A 30-minute technical session to understand your architecture bottlenecks, timeline, and growth goals."",""badge"":""01""},
  {""title"":""Blueprint or Fixed-Fee Audit"",""description"":""A concrete system blueprint, data isolation schema, or 2-week architecture audit with prioritized roadmap."",""badge"":""02""},
  {""title"":""Senior Build & Modernize"",""description"":""Principal-led engineering with modern microservices, cloud infrastructure, reactive SPAs, and AI agents with rigorous code quality."",""badge"":""03""},
  {""title"":""Handover & Enablement"",""description"":""Written architecture documentation, test coverage, and complete team handover with zero lock-in."",""badge"":""04""}
]";

    private static readonly string ProofStripCardsJson = @"[
  {""title"":""Mission-Critical Delivery"",""description"":""Audited enterprise platforms shipped globally"",""badge"":""Enterprise"",""icon"":""fas fa-history""},
  {""title"":""Clients in US, CA, SG & CY"",""description"":""International client footprint"",""badge"":""4 Key Markets"",""icon"":""fas fa-globe""},
  {""title"":""CPQ Turnaround (from 3 hrs)"",""description"":""Automated pricing calculation"",""badge"":""< 30 Seconds"",""icon"":""fas fa-bolt""},
  {""title"":""Cloud Cost Optimization"",""description"":""FinOps Azure & AWS reduction"",""badge"":""Up to 25%"",""icon"":""fas fa-chart-line""}
]";

    private static readonly string ProblemsCardsJson = @"[
  {""title"":""Cloud Costs Outpacing Revenue"",""description"":""Unoptimized Azure and AWS compute eating into margins. We identify waste, right-size infrastructure, and cut cloud spend by up to 25% without sacrificing throughput."",""badge"":""amber"",""icon"":""fas fa-chart-line""},
  {""title"":""Monolithic Bottlenecks"",""description"":""Legacy monolithic codebases holding back release velocity. We re-architect incrementally to modern, event-driven microservices with zero customer downtime."",""badge"":""red"",""icon"":""fas fa-cubes""},
  {""title"":""AI Pipelines Failing in Production"",""description"":""Prototypes that hit latency and hallucination walls. We build enterprise RAG pipelines with deterministic guardrails and scalable vector search."",""badge"":""blue"",""icon"":""fas fa-robot""},
  {""title"":""Missing Senior Tech Lead"",""description"":""Startups needing strategic architectural governance without the $250k+ full-time CTO overhead. We serve as fractional principal architects guiding your engineers."",""badge"":""green"",""icon"":""fas fa-user-shield""}
]";

    private static readonly string AuditCardsJson = @"[
  {""title"":""Fixed fee"",""description"":""from $500 with zero surprise overages"",""badge"":""Fixed Fee"",""icon"":""fas fa-check-circle""},
  {""title"":""Delivery"",""description"":""10 business days direct turnaround"",""badge"":""10 Days"",""icon"":""fas fa-clock""},
  {""title"":""Deliverables"",""description"":""FinOps savings breakdown + 90-day prioritized remediation roadmap"",""badge"":""Deliverables"",""icon"":""fas fa-file-contract""}
]";

    private static readonly string CompanyMilestonesJson = @"[
  {""title"":""Launch of Specialized Cloud & Software Architecture Studio"",""description"":""Founded Nexvoys as an elite engineering practice specializing in distributed backend architecture, high-concurrency cloud systems, and multi-tenant database partitioning for North American and European clients."",""badge"":""2021 · Foundation"",""icon"":""fas fa-rocket""},
  {""title"":""Sub-Second CPQ & High-Throughput Engines"",""description"":""Engineered enterprise CPQ (Configure, Price, Quote) engines and payment processing pipelines, slashing calculation latency from 3 hours to under 30 seconds across high-volume transactions."",""badge"":""2022 · Scale"",""icon"":""fas fa-bolt""},
  {""title"":""International Delivery Across US, Canada, France & Singapore"",""description"":""Expanded direct client delivery footprint across 4 international markets. Shipped production platforms maintaining an audited 99.99% uptime SLA with zero-downtime deployment pipelines."",""badge"":""2023 · Expansion"",""icon"":""fas fa-globe""},
  {""title"":""Autonomous AI Agents & Multi-Cloud Modernization"",""description"":""Pioneering deterministic enterprise GenAI agent pipelines, vector search platforms, and cloud modernization for next-generation enterprise SaaS systems."",""badge"":""2024–Present · Next-Gen"",""icon"":""fas fa-brain""}
]";

    private static readonly string CompanyStandardsJson = @"[
  {""title"":""Total Client IP & Repository Ownership"",""description"":""Every line of source code, deployment script, infrastructure-as-code template, and architecture document belongs exclusively to you from day one. Zero proprietary vendor lock-in."",""badge"":""01 · Legal & IP"",""icon"":""fas fa-code-branch""},
  {""title"":""Direct Principal Engineering Oversight"",""description"":""Engagements are steered and authored by senior principal architects. We do not use account managers or hand off your core architecture to junior, unvetted subcontractors."",""badge"":""02 · Quality"",""icon"":""fas fa-user-shield""},
  {""title"":""Multi-Timezone Synchronized Delivery"",""description"":""Dedicated overlapping working hours across US Eastern/Pacific, European CET, and APAC time zones for rapid code reviews, sprint alignment, and seamless real-time collaboration."",""badge"":""03 · Velocity"",""icon"":""fas fa-clock""},
  {""title"":""Enterprise Security & SOC2/OWASP Compliance"",""description"":""Production code is built against OWASP Top 10 standards, automated static analysis (SAST), strict secret management, and full NDA confidentiality protocols."",""badge"":""04 · Security"",""icon"":""fas fa-shield-alt""}
]";

    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var existingPages = await context.SitePages.Include(p => p.Sections).ToListAsync();

        var defaultPages = new List<(string Slug, string Title, string NavTitle, int Order, List<(string Key, string Title, string? Subtitle, string? Description, string? ContentJson, int SectionOrder)> Sections)>
        {
            ("", "Home", "Home", 1, new()
            {
                ("hero", "Custom software development for SaaS, Cloud & AI systems that scale.", "Custom Software Engineering", "NEXVOYS is an elite software engineering and cloud development studio. We partner with technology teams, scale-ups, and global enterprises to build resilient cloud architectures, high-performance distributed microservices, and autonomous AI systems.", null, 1),
                ("proof-strip", "Verified Production Metrics", "Production Proof", "Audited delivery track record across international production systems.", ProofStripCardsJson, 2),
                ("problems", "Problems We Solve For Growing Tech Companies", "Engineering Challenges", "We eliminate the engineering bottlenecks that drain revenue, slow release velocity, and put customer data at risk.", ProblemsCardsJson, 3),
                ("value", "Why Leading Technology Teams Partner with Nexvoys", "Our Engineering Discipline", "Senior-only engineering, collaborative technical leadership, and predictable execution without agency bloat.", ValueCardsJson, 4),
                ("services", "Core Software Engineering Services", "Our Specialist Pillars", "Five focused engineering disciplines across modern SaaS systems, autonomous AI workflows, cloud optimization, and legacy modernization.", null, 5),
                ("diagnostic-audit", "Technical Code & Cloud Cost Audit", "Fixed-Scope Technical Diagnostic", "A 2-week diagnostic designed for tech founders and engineering leaders. We examine your application codebase, cloud infrastructure spend (AWS/Azure), database performance, and security posture.", AuditCardsJson, 6),
                ("tech-matrix", "Our Specialist Stack", "Specialized Capabilities", "Deep technical depth across multi-cloud ecosystems (AWS/Azure), distributed APIs, reactive frontends, and AI agent pipelines.", null, 7),
                ("industries", "Proven Solutions Across Core Industries", "Industry Domain Mastery", "Applied software engineering for high-stakes domains: FinTech, Multi-Tenant SaaS, CPQ Engines, and HealthTech.", null, 8),
                ("case-studies", "Featured Production Case Studies", "Delivered Systems", "Production platforms, pricing calculation engines, and cloud infrastructures engineered for international clients.", null, 9),
                ("process", "How We Work Together", "Predictable Execution", "From discovery call to technical solution design, hands-on build, and production handover.", ProcessStepsJson, 10),
                ("testimonials", "Verified Client Endorsements", "Client Endorsements", "Feedback from technology leaders across the US and Europe.", null, 11),
                ("contact-hub", "Schedule a Project Consultation", "Book Strategy Call", "Speak directly with our senior software engineering team about your product roadmap, system bottlenecks, or upcoming build.", null, 12)
            }),
            ("services", "Services & Pillars", "Services", 2, new()
            {
                ("services-hero", "Custom Software Development & Cloud Solutions", "Engineering Offerings", "Senior-level software engineering for SaaS and AI platforms. Direct collaboration with experienced engineering leadership.", null, 1),
                ("services-grid", "Core Software Engineering Capabilities", "Pillar Offerings", "Deep technical deep-dives across SaaS multi-tenancy, AI agents, cloud migrations, and modern web portals.", null, 2),
                ("accordion", "Interactive Capability Pillars", "Deep-Dive Capabilities", "Explore our technical execution approach and deliverables for each primary engineering discipline.", null, 3),
                ("engagement", "Engagement Models Built For Speed & Scale", "Flexible Partnership", "Choose between Fixed-Fee Code Audits, Project-Based Build sprints, or Fractional Advisory.", ValueCardsJson, 4),
                ("services-cta", "Need a Code or Infrastructure Review?", "Engineering Advisory", "Let's review your codebase, identify scalability bottlenecks, and design a modern roadmap that drives business outcomes.", null, 5)
            }),
            ("expertise", "Technical Radar & Stacks", "Expertise", 3, new()
            {
                ("expertise-hero", "Technology Radar & Specialist Stacks", "Technical Competencies", "Specialist depth in modern backend microservices, multi-cloud platforms, reactive frontends, and AI pipelines.", null, 1),
                ("radar", "Categorized Technology Radar & Stack Matrix", "Core Stacks", "Hands-on expertise across leading enterprise frameworks, cloud ecosystems & AI pipelines with live proficiency filtering.", null, 2),
                ("certifications", "Verified Engineering Competencies", "Validated Skills", "Senior engineering competencies across cloud infrastructure, distributed microservices, and resilient systems.", null, 3),
                ("expertise-cta", "Need Guidance on Your Tech Stack?", "Technical Strategy", "Let's review your product roadmap, compare engineering trade-offs across backend runtimes and cloud platforms, and build the right system.", null, 4)
            }),
            ("projects", "Portfolio & Case Studies", "Portfolio", 4, new()
            {
                ("projects-hero", "Case Studies & Selected Work", "Portfolio Showcase", "Production platforms, automated quotation engines, and cloud infrastructures designed and delivered for international clients.", null, 1),
                ("filters", "Category Filters Toolbar", "Filter Stacks", "Filter case studies by SaaS & Cloud, Enterprise CPQ & Engines, Web Platforms, and HealthTech.", null, 2),
                ("projects-grid", "Production Case Studies Grid", "Delivered Platforms", "Explore engineering highlights, problem statements, and technical outcomes for delivered production systems.", null, 3),
                ("projects-cta", "Have a Project Requiring Senior Engineers?", "Next Steps", "Let's evaluate technical feasibility, blueprint the technical solution, and plan your engineering roadmap.", null, 4)
            }),
            ("about", "About NEXVOYS", "About", 5, new()
            {
                ("about-hero", "Engineering Systems That Power High-Scale Growth", "Software Engineering Studio", "Nexvoys is an elite software engineering and cloud solutions studio. We partner with technology leaders, enterprises, and scale-ups to build resilient SaaS platforms, autonomous AI workflows, and mission-critical cloud infrastructure.", null, 1),
                ("vision", "Engineering Rigor, Direct Access, Zero Delegation Bloat", "Our Operating Model", "Nexvoys operates as an enterprise software development and engineering firm. We eliminate agency overhead: our clients collaborate directly with senior engineers who design, build, and ship production systems.", null, 2),
                ("focus-areas", "Ready to Build Your Next Production Platform?", "Let's Collaborate", "Whether you need custom software development, fractional technical advisory, or system modernization, let's schedule an introductory discovery session.", null, 3),
                ("execution", "How Nexvoys Delivers Lasting Value to Enterprise Teams", "Strategic Value", "Zero vendor lock-in, sub-second performance, health-grade data security, and cost-aware scalability.", ValueCardsJson, 4),
                ("milestones", "Company Track Record & Engineering Milestones", "Company Evolution", "A history of building, scaling, and deploying mission-critical systems for international enterprises and high-growth startups.", CompanyMilestonesJson, 5),
                ("credentials", "Institutional Standards & Operating Governance", "Enterprise Commitments", "How we guarantee code quality, legal protection, security compliance, and commercial agility for every client.", CompanyStandardsJson, 6)
            }),
            ("contact", "Consultation & Contact", "Contact Us", 6, new()
            {
                ("contact-hero", "Book a Discovery Call", "Let's Collaborate", "Whether you are planning a new SaaS product, integrating AI agents, or modernizing legacy systems, let's discuss your technical roadmap.", null, 1),
                ("contact-form", "Schedule a Technical Consultation", "Book Strategy Call", "Select your primary objective so we can prepare relevant technical solutions and case studies.", null, 2),
                ("contact-channels", "Direct Communication Channels", "Global Reach", "Direct email, international phone, WhatsApp, and location details for international collaboration.", null, 3)
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
                    sec.DisplayOrder = sDef.SectionOrder;
                    bool isOutdated = string.IsNullOrWhiteSpace(sec.Description) ||
                        (sec.Description != null && (sec.Description.Contains("founder") || sec.Description.Contains("Founder") || sec.Description.Contains("Bilal") || sec.Description.Contains("architecture") || sec.Description.Contains("Architecture"))) ||
                        (sec.Subtitle != null && (sec.Subtitle.Contains("Founder-Led") || sec.Subtitle.Contains("founder") || sec.Subtitle.Contains("Architecture") || sec.Subtitle.Contains("architecture"))) ||
                        (sec.Title != null && (sec.Title.Contains("Architecture") || sec.Title.Contains("Senior architecture for SaaS") || sec.Title.Contains("Startups & SMBs Partner") ||
                         sec.Title.EndsWith("Header") || sec.Title.EndsWith("Intro") || sec.Title.EndsWith("Grid") ||
                         sec.Title == "How Solutions Architecture Delivers Value To Your Business" ||
                         sec.Title == "Three Steps. That's All It Takes."));

                    if (isOutdated)
                    {
                        sec.Title = sDef.Title;
                        sec.Subtitle = sDef.Subtitle;
                        sec.Description = sDef.Description;
                    }

                    if (!string.IsNullOrWhiteSpace(sDef.ContentJson))
                    {
                        if (string.IsNullOrWhiteSpace(sec.ContentJson) || 
                            sec.ContentJson.Contains("Direct Architect Access") ||
                            sec.ContentJson.Contains("9+ Years") ||
                            sec.ContentJson.Contains("Task Automation") || 
                            sec.ContentJson.Contains("Tell Us What You Need"))
                        {
                            sec.ContentJson = sDef.ContentJson;
                        }
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
