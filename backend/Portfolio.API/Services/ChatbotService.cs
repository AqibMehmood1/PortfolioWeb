using System.Text.RegularExpressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Services;

public class ChatbotService : IChatbotService
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public ChatbotService(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    public async Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto request)
    {
        var rawMsg = request.Message?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(rawMsg))
        {
            return GetWelcomeResponse();
        }

        var normalized = CleanText(rawMsg);

        // 1. SPECIFIC NAMED PROJECT CHECKS
        var projectMatch = await MatchSpecificProjectAsync(normalized);
        if (projectMatch != null)
        {
            return projectMatch;
        }

        // 2. SEMANTIC INTENT CLASSIFIER WITH WEIGHTED SCORING
        var bestIntent = ClassifyIntent(normalized);

        switch (bestIntent)
        {
            case IntentType.AboutAndExperience:
                return await GetAboutAndExperienceResponseAsync(normalized);

            case IntentType.ProjectsAndPortfolios:
                return await GetProjectsListResponseAsync();

            case IntentType.SaaSAndMultiTenancy:
                return GetSaaSResponse();

            case IntentType.AiAndGenAi:
                return GetAiAgentsResponse();

            case IntentType.LegacyDotNetModernization:
                return GetModernizationResponse();

            case IntentType.CloudAndDevOps:
                return GetCloudCostResponse();

            case IntentType.TechRadar:
                return await GetTechRadarResponseAsync();

            case IntentType.PricingAndEngagement:
                return GetPricingResponse();

            case IntentType.ContactAndHiring:
                return GetContactResponse();

            case IntentType.TestimonialsAndReviews:
                return await GetTestimonialsResponseAsync();

            case IntentType.Greeting:
                return GetWelcomeResponse();

            default:
                // Fallback: search database for any matches
                var searchFallback = await SearchDatabaseFallbackAsync(rawMsg, normalized);
                if (searchFallback != null)
                {
                    return searchFallback;
                }
                return GetGuidedDefaultResponse(rawMsg);
        }
    }

    public async Task<bool> RecordLeadInquiryAsync(SubmitChatInquiryDto dto, string? ipAddress)
    {
        var inquiry = new ContactInquiry
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Phone = dto.Phone?.Trim() ?? string.Empty,
            Company = dto.Company?.Trim() ?? string.Empty,
            Subject = $"[Chatbot Lead] {dto.Topic ?? "Architecture & Engineering Consultation"}",
            TechStack = dto.Topic ?? "Chatbot Inbound Lead",
            Message = dto.Message.Trim(),
            Status = "New",
            AdminNotes = $"Submitted via interactive public website chatbot at {DateTime.UtcNow:u}",
            CreatedAt = DateTime.UtcNow
        };

        await _context.ContactInquiries.AddAsync(inquiry);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync(
            "ChatbotInquiry",
            "ContactInquiry",
            inquiry.Id.ToString(),
            $"New lead from chatbot: {inquiry.Name} ({inquiry.Email})",
            null,
            "PublicChatbot",
            ipAddress
        );

        return true;
    }

    #region Intent Classifier

    private enum IntentType
    {
        Unknown,
        Greeting,
        AboutAndExperience,
        ProjectsAndPortfolios,
        SaaSAndMultiTenancy,
        AiAndGenAi,
        LegacyDotNetModernization,
        CloudAndDevOps,
        TechRadar,
        PricingAndEngagement,
        ContactAndHiring,
        TestimonialsAndReviews
    }

    private IntentType ClassifyIntent(string text)
    {
        var scores = new Dictionary<IntentType, int>
        {
            { IntentType.AboutAndExperience, 0 },
            { IntentType.ProjectsAndPortfolios, 0 },
            { IntentType.SaaSAndMultiTenancy, 0 },
            { IntentType.AiAndGenAi, 0 },
            { IntentType.LegacyDotNetModernization, 0 },
            { IntentType.CloudAndDevOps, 0 },
            { IntentType.TechRadar, 0 },
            { IntentType.PricingAndEngagement, 0 },
            { IntentType.ContactAndHiring, 0 },
            { IntentType.TestimonialsAndReviews, 0 },
            { IntentType.Greeting, 0 }
        };

        // --- 1. ABOUT & EXPERIENCE SCORING ---
        if (ContainsPhrase(text, "how much experience", "how many years", "years of experience", "years experience", 
            "company experience", "tell me about nexvoys", "tell me about yourself", "tell me about company", 
            "who is nexvoys", "who are you", "what is nexvoys", "about nexvoys", "about your company", "about company",
            "where are you located", "where is your office", "where are you based", "company background", 
            "who founded", "founder", "leadership team", "how old is nexvoys", "how long have you been"))
        {
            scores[IntentType.AboutAndExperience] += 25;
        }
        if (ContainsWords(text, "experience", "background", "history", "years", "founded", "journey", "profile", "bio", "leadership"))
        {
            scores[IntentType.AboutAndExperience] += 8;
        }
        if (ContainsWords(text, "location", "located", "based", "headquarters", "city", "country", "office"))
        {
            scores[IntentType.AboutAndExperience] += 6;
        }

        // --- 2. PROJECTS & PORTFOLIO SCORING ---
        if (ContainsPhrase(text, "show portfolio", "show portfolios", "provide portfolio", "provide portfolios", 
            "your portfolio", "your portfolios", "show me your work", "show projects", "past projects", 
            "case studies", "case study", "delivered systems", "what have you built", "what have you done", 
            "showcase", "sample projects", "live demos", "delivered work", "client work", "portfolio list"))
        {
            scores[IntentType.ProjectsAndPortfolios] += 25;
        }
        if (ContainsWords(text, "portfolio", "portfolios", "projects", "case-studies", "casestudies", "showcase", "demos"))
        {
            scores[IntentType.ProjectsAndPortfolios] += 12;
        }

        // --- 3. AI & GENAI SCORING ---
        if (ContainsPhrase(text, "ai agents", "autonomous agents", "genai", "generative ai", "rag pipeline", 
            "semantic kernel", "langchain", "vector database", "tool calling", "llm integration", "openai api"))
        {
            scores[IntentType.AiAndGenAi] += 25;
        }
        if (ContainsWords(text, "ai", "agent", "agents", "genai", "llm", "rag", "langchain", "openai", "gpt", "claude", "qdrant", "pinecone", "chatbot", "chatbots"))
        {
            scores[IntentType.AiAndGenAi] += 10;
        }

        // --- 4. SAAS & MULTI-TENANCY SCORING ---
        if (ContainsPhrase(text, "multi-tenant", "multi tenant", "multitenancy", "multitenant", "tenant isolation", 
            "saas architecture", "b2b saas", "subscription billing", "stripe integration", "data partitioning"))
        {
            scores[IntentType.SaaSAndMultiTenancy] += 25;
        }
        if (ContainsWords(text, "saas", "multitenancy", "multitenant", "tenant", "tenants", "lemonsqueezy"))
        {
            scores[IntentType.SaaSAndMultiTenancy] += 12;
        }

        // --- 5. LEGACY .NET MODERNIZATION SCORING ---
        if (ContainsPhrase(text, "legacy .net", "dotnet 9", ".net 9", "net 9", "net9", "asp.net core", 
            "upgrade to .net", "migrate to .net", "webforms migration", "monolith to microservices", "refactor monolith"))
        {
            scores[IntentType.LegacyDotNetModernization] += 25;
        }
        if (ContainsWords(text, "legacy", ".net", "dotnet", "c#", "csharp", "webforms", "modernize", "modernization", "refactoring", "monolith"))
        {
            scores[IntentType.LegacyDotNetModernization] += 10;
        }

        // --- 6. CLOUD & DEVOPS & COST SCORING ---
        if (ContainsPhrase(text, "cloud cost", "reduce cloud", "cost optimization", "cloud migration", 
            "azure devops", "aws architecture", "kubernetes cluster", "docker container", "ci/cd pipeline"))
        {
            scores[IntentType.CloudAndDevOps] += 25;
        }
        if (ContainsWords(text, "azure", "aws", "kubernetes", "k8s", "devops", "terraform", "serverless"))
        {
            scores[IntentType.CloudAndDevOps] += 8;
        }

        // --- 7. TECH RADAR SCORING ---
        if (ContainsPhrase(text, "tech stack", "technology stack", "tech radar", "technologies do you use", 
            "what tech do you use", "what stack", "what tools", "frontend stack", "backend stack", "database stack"))
        {
            scores[IntentType.TechRadar] += 25;
        }
        if (ContainsWords(text, "stack", "technologies", "radar", "angular", "react", "typescript", "postgres", "redis", "mongodb", "python"))
        {
            scores[IntentType.TechRadar] += 8;
        }

        // --- 8. PRICING & ENGAGEMENT SCORING ---
        // Disambiguation: Only score pricing if NOT asking about "how much experience"
        bool isExperienceQuery = ContainsPhrase(text, "experience", "years", "time in business", "history");
        if (!isExperienceQuery)
        {
            if (ContainsPhrase(text, "how much does it cost", "how much do you charge", "what are your rates", 
                "hourly rate", "project cost", "pricing model", "engagement model", "cost estimate", "request quote"))
            {
                scores[IntentType.PricingAndEngagement] += 25;
            }
            if (ContainsWords(text, "pricing", "price", "rates", "rate", "quote", "budget", "retainer", "fee", "fees", "cost", "charges"))
            {
                scores[IntentType.PricingAndEngagement] += 10;
            }
        }

        // --- 9. CONTACT & HIRING SCORING ---
        if (ContainsPhrase(text, "how to hire", "hire you", "hire your team", "schedule a call", 
            "book a call", "book consultation", "schedule consultation", "get in touch", "contact you", 
            "whatsapp number", "email address", "phone number", "start a project", "discuss my project"))
        {
            scores[IntentType.ContactAndHiring] += 25;
        }
        if (ContainsWords(text, "hire", "contact", "consultation", "meeting", "call", "whatsapp", "email", "phone", "appointment", "reach"))
        {
            scores[IntentType.ContactAndHiring] += 8;
        }

        // --- 10. TESTIMONIALS & REVIEWS SCORING ---
        if (ContainsPhrase(text, "client reviews", "customer reviews", "what clients say", "what do your clients say", 
            "what do clients say", "client testimonials", "case proof", "ratings", "feedback", "what people say", 
            "client feedback", "reviews from clients", "happy clients", "client satisfaction"))
        {
            scores[IntentType.TestimonialsAndReviews] += 25;
        }
        if (ContainsWords(text, "testimonial", "testimonials", "reviews", "review", "ratings", "rating", "endorsements", "endorsement", "reputation", "feedback"))
        {
            scores[IntentType.TestimonialsAndReviews] += 12;
        }

        // --- 11. GREETING SCORING ---
        if (text.Length < 25 && ContainsWords(text, "hi", "hello", "hey", "greetings", "good morning", "good evening", "good afternoon", "howdy", "hola", "sup"))
        {
            scores[IntentType.Greeting] += 15;
        }

        // Find highest scoring intent
        var topIntent = scores.OrderByDescending(kv => kv.Value).First();
        return topIntent.Value > 0 ? topIntent.Key : IntentType.Unknown;
    }

    #endregion

    #region Specific Intent Responses

    private async Task<ChatResponseDto?> MatchSpecificProjectAsync(string query)
    {
        var projects = await _context.Projects
            .Where(p => p.IsActive && p.IsPublished)
            .ToListAsync();

        foreach (var p in projects)
        {
            var titleLower = p.Title.ToLowerInvariant();
            var slugLower = p.Slug.ToLowerInvariant();

            bool isMatch = false;
            if (slugLower.Contains("odtool") && (query.Contains("odtool") || query.Contains("cpq") || query.Contains("quotation") || query.Contains("odyssey"))) isMatch = true;
            else if (slugLower.Contains("eurobank") && (query.Contains("eurobank") || query.Contains("banking") || query.Contains("bank portal") || query.Contains("fintech"))) isMatch = true;
            else if (slugLower.Contains("cloudoor") && (query.Contains("cloudoor") || query.Contains("azure automation") || query.Contains("cloud saas"))) isMatch = true;
            else if (slugLower.Contains("scrole") && (query.Contains("scrole") || query.Contains("scrolling") || query.Contains("feed platform"))) isMatch = true;
            else if (slugLower.Contains("medikea") && (query.Contains("medikea") || query.Contains("telemedicine") || query.Contains("doctor") || query.Contains("healthcare"))) isMatch = true;
            else if (slugLower.Contains("link") && (query.Contains("linkscenter") || query.Contains("links center") || query.Contains("curation"))) isMatch = true;
            else if (query.Contains(titleLower) || query.Contains(slugLower)) isMatch = true;

            if (isMatch)
            {
                var techList = new List<string>();
                try
                {
                    if (!string.IsNullOrEmpty(p.TechnologiesJson))
                    {
                        techList = JsonSerializer.Deserialize<List<string>>(p.TechnologiesJson) ?? new();
                    }
                }
                catch { }

                var techString = techList.Count > 0 ? string.Join(", ", techList) : ".NET 9, Angular, SQL Server, Redis";

                return new ChatResponseDto
                {
                    Reply = $"### 💼 Case Study: **{p.Title}**\n\n**Category**: {p.Category}\n\n**Business Challenge**:\n{p.Problem}\n\n**Architecture & Engineering Solution**:\n{p.Architecture}\n\n🛠️ **Tech Stack**: `{techString}`\n\nWould you like to build a similar high-scale solution or discuss your project requirements?",
                    SuggestedActions = new List<string>
                    {
                        "See All Case Studies",
                        "Discuss My Project Scope",
                        "Tech Stack & Radar",
                        "Schedule Architecture Review"
                    },
                    Links = new List<ChatActionLinkDto>
                    {
                        new() { Label = $"View {p.Title} in Portfolio", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                        new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
                        new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" }
                    },
                    IsLeadCapturePrompt = true
                };
            }
        }

        return null;
    }

    private async Task<ChatResponseDto> GetAboutAndExperienceResponseAsync(string query)
    {
        var about = await _context.AboutContents.FirstOrDefaultAsync(a => a.SectionKey == "main" && a.IsActive);
        var headline = about?.VisionHeadline ?? "Enterprise Software Architecture & Scale";
        var lead = about?.VisionLead ?? "9+ Years Designing Resilient Cloud & AI Systems";

        return new ChatResponseDto
        {
            Reply = $"### 🏛️ NEXVOYS Experience & Background\n\n**NEXVOYS** has **over 9+ years of professional enterprise experience** architecting, engineering, and scaling mission-critical software globally.\n\n- 🌍 **Global Track Record**: Delivered enterprise solutions for tech companies and founders across the **United States, Canada, the UK, Europe, and Asia**.\n- 🏆 **Key Domains**: High-Concurrency Multi-Tenant SaaS, Autonomous AI Agents (LangChain / Semantic Kernel), Legacy .NET 9 Modernization, and Cloud Cost Optimization.\n- ⚡ **Scale & Performance**: Engineered systems processing hundreds of thousands of daily transactions with **99.9% uptime** and sub-second SLAs.\n- 📍 **Headquarters**: Lahore, Pakistan with full remote availability across US & European timezones.\n\nWould you like to explore our delivered case studies or discuss how we can assist your project?",
            SuggestedActions = new List<string>
            {
                "Showcase of Case Studies",
                "Explore 5 Architecture Pillars",
                "Core Technology Radar",
                "Schedule a Consultation"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "About NEXVOYS", Url = "/about", Type = "internal", Icon = "fas fa-info-circle" },
                new() { Label = "Delivered Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-briefcase" },
                new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
                new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private async Task<ChatResponseDto> GetProjectsListResponseAsync()
    {
        var projects = await _context.Projects
            .Where(p => p.IsActive && p.IsPublished)
            .OrderBy(p => p.DisplayOrder)
            .Take(6)
            .ToListAsync();

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("### 📂 Delivered Enterprise Case Studies & Portfolios\n");
        sb.AppendLine("NEXVOYS has engineered and scaled mission-critical software systems globally:\n");

        if (projects.Count > 0)
        {
            int index = 1;
            foreach (var p in projects)
            {
                var summary = !string.IsNullOrWhiteSpace(p.Description) 
                    ? p.Description 
                    : (!string.IsNullOrWhiteSpace(p.Problem) ? p.Problem : p.Category);
                
                if (summary.Length > 120) summary = summary.Substring(0, 117) + "...";
                sb.AppendLine($"{index}. **{p.Title}** *({p.Category})*: {summary}");
                index++;
            }
        }
        else
        {
            sb.AppendLine("1. **ODTool Quotation Engine** *(Odyssey Design, Texas)*: Automated 3-hour manual quotation spreadsheets into a 30-second automated .NET calculation engine.");
            sb.AppendLine("2. **Eurobank Banking Portal** *(Fintech)*: Zero-downtime, secure customer banking portal with strict RBAC authorization and OAuth2/JWT security.");
            sb.AppendLine("3. **Cloudoor Cloud SaaS** *(San Francisco)*: Multi-tenant Azure automation platform cutting cloud overhead by 25%.");
            sb.AppendLine("4. **Scrole Web Platform**: High-traffic, interactive Angular web application with sub-second rendering.");
            sb.AppendLine("5. **Medikea Telemedicine**: HIPAA-aligned healthcare portal with live WebSockets doctor-patient consultation queues.");
            sb.AppendLine("6. **LinksCenter**: High-traffic link curation portal with Redis caching, boosting page speed by 40%.");
        }

        sb.AppendLine("\nWould you like a deep-dive into any specific case study, or would you like to discuss your own project roadmap?");

        var links = new List<ChatActionLinkDto>
        {
            new() { Label = "Browse All Projects", Url = "/projects", Type = "internal", Icon = "fas fa-briefcase" },
            new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
            new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" }
        };

        return new ChatResponseDto
        {
            Reply = sb.ToString(),
            SuggestedActions = new List<string>
            {
                "Tell me about ODTool CPQ",
                "Tell me about Eurobank Banking",
                "Tell me about Cloudoor SaaS",
                "How to Hire / Engagement Models"
            },
            Links = links,
            IsLeadCapturePrompt = true
        };
    }

    private ChatResponseDto GetSaaSResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### 🏢 SaaS Architecture & Multi-Tenancy\n\nNEXVOYS designs end-to-end SaaS platforms built to scale from early prototype to millions of active users with **99.9% uptime**:\n\n- **Tenant Data Isolation**: Database schema partitioning, row-level security barriers, and tenant connection routing.\n- **Subscription Billing**: Complete Stripe, LemonSqueezy, and paddle recurring subscription automation with webhooks.\n- **Distributed Caching & High Throughput**: Redis cluster caching for sub-second page loads and query acceleration.\n- **Zero-Downtime Resilience**: Blue/green containerized deployments, health-check probes, and auto-scaling policies.\n\nWe architected **Cloudoor Cloud SaaS** and **ODTool CPQ**, both achieving sub-second response times under heavy concurrent tenant workloads.",
            SuggestedActions = new List<string>
            {
                "See Cloudoor SaaS Case Study",
                "See ODTool CPQ Case Study",
                "Schedule SaaS Architecture Audit",
                "Explore All Core Services"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "SaaS Architecture Pillar", Url = "/services", Type = "internal", Icon = "fas fa-cubes" },
                new() { Label = "Explore Projects", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                new() { Label = "Book Strategy Call", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private ChatResponseDto GetAiAgentsResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### 🤖 Autonomous AI Agents & Enterprise GenAI\n\nNEXVOYS architects production-ready, mission-critical AI capabilities:\n\n1. **Autonomous Tool-Calling Agents**: Reasoning LLM pipelines capable of executing complex multi-step business workflows without manual intervention.\n2. **Enterprise RAG Architectures**: High-precision vector retrieval using vector databases (Qdrant, Pinecone, pgvector) with hybrid semantic & keyword embeddings.\n3. **Framework Integration**: Deep implementation experience with **LangChain**, **Semantic Kernel**, OpenAI API, Anthropic Claude, and Ollama.\n4. **Document Intelligence & Automation**: Automated multi-format parsing, summarization, structured JSON extraction, and sentiment classification.\n\nWould you like to build an AI agent workflow or integrate AI into your existing product?",
            SuggestedActions = new List<string>
            {
                "Discuss an AI Agent Project",
                "See Case Studies & Work",
                "Tech Radar & AI Stack",
                "Schedule Architecture Call"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "AI Architecture Details", Url = "/services", Type = "internal", Icon = "fas fa-robot" },
                new() { Label = "Book Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
                new() { Label = "Chat on WhatsApp", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private ChatResponseDto GetModernizationResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### ⚡ Legacy .NET & Web Modernization\n\nTransform legacy technical debt into scalable, high-speed enterprise assets:\n\n- **Upgrade Legacy ASP.NET**: Transitioning monolithic ASP.NET WebForms/MVC applications to **.NET 9 Core**.\n- **Microservices Refactoring**: Decoupling complex monoliths into independently scalable microservices with event-driven architecture.\n- **40%+ Throughput Increase**: Non-blocking asynchronous query pipelines, EF Core query tuning, connection pooling, and Redis caching.\n- **Modern Frontends**: Pairing high-performance .NET 9 backends with reactive Angular 18 or React SPAs.",
            SuggestedActions = new List<string>
            {
                "Discuss Modernization Scope",
                "Eurobank Banking Study",
                "ODTool CPQ Engine Study",
                "Book Architecture Review"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Modernization Service", Url = "/services", Type = "internal", Icon = "fas fa-sync-alt" },
                new() { Label = "View .NET Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                new() { Label = "Contact Engineering Team", Url = "/contact", Type = "internal", Icon = "fas fa-envelope" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private ChatResponseDto GetCloudCostResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### ☁️ Cloud Migration & Cost Optimization\n\nEliminate bloated cloud bills and fragile hosting setups. NEXVOYS provides:\n\n- **25% Cloud Cost Reduction**: Auditing Azure & AWS workloads to rightsize compute, auto-scale storage, and prune redundant services.\n- **Zero-Downtime Migration**: Seamless legacy-to-cloud database and application transitions.\n- **Container Orchestration**: Docker containerization and Kubernetes (AKS / EKS) orchestration.\n- **Automated CI/CD**: High-velocity release pipelines via GitHub Actions and Azure DevOps.\n\nWe reduced monthly cloud costs by **25%** for enterprise clients in San Francisco and Paris.",
            SuggestedActions = new List<string>
            {
                "Book Cloud Infrastructure Audit",
                "View Cloudoor Project",
                "Tech Radar & Cloud Stack",
                "Schedule Consultation"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Cloud Optimization Service", Url = "/services", Type = "internal", Icon = "fas fa-cloud" },
                new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-alt" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private async Task<ChatResponseDto> GetTechRadarResponseAsync()
    {
        var cats = await _context.TechnologyCategories
            .Include(c => c.Technologies)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("### 🛠️ Core Technology Radar & Architecture Stacks\n");
        sb.AppendLine("NEXVOYS delivers with a modern, battle-tested technology ecosystem:\n");

        if (cats.Count > 0)
        {
            foreach (var c in cats)
            {
                var techNames = c.Technologies.Where(t => t.IsActive).Select(t => t.Name).ToList();
                if (techNames.Count > 0)
                {
                    sb.AppendLine($"- **{c.Label}**: {string.Join(", ", techNames)}");
                }
            }
        }
        else
        {
            sb.AppendLine("- **Backend Core**: .NET 9, C#, ASP.NET WebAPI, Entity Framework Core, Node.js, Python, REST APIs, WebSockets");
            sb.AppendLine("- **Frontend SPAs**: Angular 18, React, Next.js, TypeScript, TailwindCSS, Bootstrap 5");
            sb.AppendLine("- **Databases & Caching**: SQL Server, PostgreSQL, Redis, MongoDB, Vector Databases (Qdrant, Pinecone)");
            sb.AppendLine("- **Cloud & DevOps**: Microsoft Azure, AWS, Docker, Kubernetes, CI/CD, Terraform");
            sb.AppendLine("- **AI & Automation**: LangChain, Semantic Kernel, OpenAI, Custom LLM Tool-Calling Agents");
        }

        return new ChatResponseDto
        {
            Reply = sb.ToString(),
            SuggestedActions = new List<string>
            {
                "Explore Delivered Projects",
                "Discuss an AI or .NET Project",
                "SaaS Multi-Tenancy Architecture",
                "Schedule Tech Discussion"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Explore Full Tech Radar", Url = "/expertise", Type = "internal", Icon = "fas fa-layer-group" },
                new() { Label = "View Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                new() { Label = "Contact Us", Url = "/contact", Type = "internal", Icon = "fas fa-envelope" }
            },
            IsLeadCapturePrompt = false
        };
    }

    private ChatResponseDto GetPricingResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### 💼 Engagement Models & Pricing\n\nNEXVOYS offers 3 flexible engagement models designed for startups, scaleups, and enterprises:\n\n1. **Full-Cycle Project Architecture & Build**: Fixed-scope or milestone-based delivery with clear SLAs, architecture blueprints, and CI/CD pipelines.\n2. **Fractional Solutions Architect / CTO Advisory**: Senior technical leadership on a monthly retainer to guide technology choices, conduct code audits, and lead engineering teams.\n3. **Dedicated Engineer Embedding within 24 Hours**: Fast placement of specialized senior .NET, AI, or Angular engineers embedded directly into your agile workflow.\n\nLet us know what you are looking to build, and we can provide a tailored estimate and roadmap!",
            SuggestedActions = new List<string>
            {
                "Request a Custom Quote",
                "Schedule Consultation",
                "Chat on WhatsApp",
                "See Case Studies"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Book Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
                new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" },
                new() { Label = "Browse Portfolio", Url = "/projects", Type = "internal", Icon = "fas fa-briefcase" }
            },
            IsLeadCapturePrompt = true
        };
    }

    private ChatResponseDto GetContactResponse()
    {
        return new ChatResponseDto
        {
            Reply = "### 🤝 Connect with NEXVOYS Leadership\n\nWe are available for new software builds, architectural advisory, and scaling initiatives:\n\n- 📧 **Email**: [nexvoys@gmail.com](mailto:nexvoys@gmail.com)\n- 📱 **WhatsApp Direct**: [+92 345 6466188](https://wa.me/923456466188)\n- 📍 **Location**: Lahore, Pakistan · Global Remote (US, Canada, Europe)\n\nYou can also submit your requirements directly here in this chat using the button below, and our engineering leadership will respond within 24 hours!",
            SuggestedActions = new List<string>
            {
                "Book Consultation Online",
                "Open WhatsApp Chat",
                "View Portfolio Case Studies"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-alt" },
                new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" },
                new() { Label = "Browse Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" }
            },
            IsLeadCapturePrompt = true
        };
    }

    private async Task<ChatResponseDto> GetTestimonialsResponseAsync()
    {
        var testimonials = await _context.Testimonials
            .Where(t => t.IsActive && t.IsPublished)
            .OrderBy(t => t.DisplayOrder)
            .Take(3)
            .ToListAsync();

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("### 🌟 Client Feedback & Endorsements\n");
        sb.AppendLine("Here is what tech leaders and enterprise founders say about working with NEXVOYS:\n");

        if (testimonials.Count > 0)
        {
            foreach (var t in testimonials)
            {
                sb.AppendLine($"> *\"{t.Quote}\"*");
                sb.AppendLine($"— **{t.Author}**, {t.Role} ({t.Tag})\n");
            }
        }
        else
        {
            sb.AppendLine("> *\"NEXVOYS transformed our complex quotation workflow into a sub-second automated engine. Outstanding architecture and execution.\"*");
            sb.AppendLine("— **Odyssey Design**, Texas (Manufacturing CPQ)\n");
            sb.AppendLine("> *\"Architected our banking portal with zero downtime and ironclad security. Highly recommended.\"*");
            sb.AppendLine("— **Eurobank Fintech**, London\n");
        }

        return new ChatResponseDto
        {
            Reply = sb.ToString(),
            SuggestedActions = new List<string>
            {
                "View Case Studies",
                "SaaS Multi-Tenancy Architecture",
                "Schedule Consultation"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "View Portfolio Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" }
            },
            IsLeadCapturePrompt = true
        };
    }

    private async Task<ChatResponseDto?> SearchDatabaseFallbackAsync(string rawQuery, string normalized)
    {
        // Try searching projects
        var matchedProject = await _context.Projects
            .Where(p => p.IsActive && p.IsPublished && 
                (p.Title.Contains(rawQuery) || p.Category.Contains(rawQuery) || p.Problem.Contains(rawQuery) || p.Architecture.Contains(rawQuery)))
            .FirstOrDefaultAsync();

        if (matchedProject != null)
        {
            return new ChatResponseDto
            {
                Reply = $"### 💼 Related Project: **{matchedProject.Title}**\n\n**Category**: {matchedProject.Category}\n\n**Overview**:\n{matchedProject.Description}\n\n**Architecture & Engineering**:\n{matchedProject.Architecture}\n\nWould you like to explore this project further or discuss your own application?",
                SuggestedActions = new List<string>
                {
                    "View All Case Studies",
                    "Discuss Project Requirements",
                    "Schedule Consultation"
                },
                Links = new List<ChatActionLinkDto>
                {
                    new() { Label = "View in Portfolio", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                    new() { Label = "Book Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" }
                },
                IsLeadCapturePrompt = true
            };
        }

        // Try searching services
        var matchedService = await _context.Services
            .Where(s => s.IsPublished && (s.Title.Contains(rawQuery) || s.ShortDescription.Contains(rawQuery)))
            .FirstOrDefaultAsync();

        if (matchedService != null)
        {
            return new ChatResponseDto
            {
                Reply = $"### 🏛️ Architectural Service: **{matchedService.Title}**\n\n{matchedService.ShortDescription}\n\nNEXVOYS specializes in high-concurrency systems, multi-tenancy, and autonomous AI agents designed to scale seamlessly.",
                SuggestedActions = new List<string>
                {
                    "Explore All Services",
                    "View Case Studies",
                    "Schedule Consultation"
                },
                Links = new List<ChatActionLinkDto>
                {
                    new() { Label = "View Service Details", Url = "/services", Type = "internal", Icon = "fas fa-cubes" },
                    new() { Label = "Schedule Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" }
                },
                IsLeadCapturePrompt = false
            };
        }

        return null;
    }

    private ChatResponseDto GetWelcomeResponse()
    {
        return new ChatResponseDto
        {
            Reply = "Hello and welcome to **NEXVOYS**! 🚀\n\nI am your interactive **Solutions Architecture Assistant**. NEXVOYS has over **9+ years of international delivery experience** helping Startups, SMBs, and Enterprises across the US, Canada, and Europe build:\n\n- 🏗️ **Multi-Tenant SaaS Platforms** with scalable data partitioning\n- 🤖 **Autonomous AI Agent Pipelines** & Enterprise RAG\n- ⚡ **High-Performance .NET 9 Microservices** & Modern SPAs\n- ☁️ **Cloud Cost Optimization** (saving up to 25% on Azure/AWS)\n\nWhat would you like to explore today?",
            SuggestedActions = new List<string>
            {
                "Showcase of Delivered Case Studies",
                "SaaS Architecture & Multi-Tenancy",
                "Autonomous AI Agents & GenAI",
                "Tech Radar & Stacks",
                "Schedule Consultation"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Our Core Pillars", Url = "/services", Type = "internal", Icon = "fas fa-cubes" },
                new() { Label = "Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-laptop-code" },
                new() { Label = "Book Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" },
                new() { Label = "WhatsApp Direct", Url = "https://wa.me/923456466188", Type = "external", Icon = "fab fa-whatsapp" }
            }
        };
    }

    private ChatResponseDto GetGuidedDefaultResponse(string rawMsg)
    {
        return new ChatResponseDto
        {
            Reply = $"I'm here to assist you with any questions regarding **\"{rawMsg}\"** or our enterprise capabilities!\n\n**NEXVOYS** is an **Enterprise Technology Partner & Solutions Architect** with 9+ years of experience specialized in designing multi-tenant SaaS products, autonomous AI agent pipelines, cloud cost optimization, and legacy .NET modernization.\n\nHere are some popular topics you can explore:",
            SuggestedActions = new List<string>
            {
                "Show Case Studies & Portfolios",
                "SaaS Multi-Tenancy Architecture",
                "Autonomous AI Agents & GenAI",
                "Legacy .NET 9 Modernization",
                "Schedule a Free Consultation"
            },
            Links = new List<ChatActionLinkDto>
            {
                new() { Label = "Delivered Case Studies", Url = "/projects", Type = "internal", Icon = "fas fa-briefcase" },
                new() { Label = "Core Services", Url = "/services", Type = "internal", Icon = "fas fa-cubes" },
                new() { Label = "Tech Radar", Url = "/expertise", Type = "internal", Icon = "fas fa-layer-group" },
                new() { Label = "Book Consultation", Url = "/contact", Type = "internal", Icon = "fas fa-calendar-check" }
            }
        };
    }

    private static string CleanText(string text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;
        var clean = Regex.Replace(text.ToLowerInvariant(), @"[^\w\s\.\#\+\-]", " ");
        return Regex.Replace(clean, @"\s+", " ").Trim();
    }

    private static bool ContainsPhrase(string text, params string[] phrases)
    {
        if (string.IsNullOrEmpty(text)) return false;
        foreach (var p in phrases)
        {
            if (string.IsNullOrEmpty(p)) continue;
            if (text.Contains(p, StringComparison.OrdinalIgnoreCase)) return true;
        }
        return false;
    }

    private static bool ContainsWords(string text, params string[] words)
    {
        if (string.IsNullOrEmpty(text)) return false;
        foreach (var w in words)
        {
            if (string.IsNullOrEmpty(w)) continue;
            if (Regex.IsMatch(text, $@"\b{Regex.Escape(w)}[s]?\b", RegexOptions.IgnoreCase)) return true;
        }
        return false;
    }

    #endregion
}
