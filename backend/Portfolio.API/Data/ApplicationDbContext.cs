using Microsoft.EntityFrameworkCore;
using Portfolio.API.Models;

namespace Portfolio.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ServiceEntity> Services => Set<ServiceEntity>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<Certification> Certifications => Set<Certification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var staticDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Seed initial project data
        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = 1,
                Slug = "scrole",
                Title = "Scrole Web Platform",
                Category = "Interactive Web Platform",
                FilterCategory = "web",
                Image = "assets/img/scrole.png",
                Gif = "assets/img/Scrole.gif",
                Description = "High-performance interactive web application built for seamless engagement, dynamic rendering, and responsive real-time data sync.",
                Problem = "The client needed a responsive, dynamic web portal capable of smooth animation flows and rapid interaction without compromising page load speeds.",
                Architecture = "Engineered with Angular and clean TypeScript components, utilizing reactive state management and CDN edge caching.",
                LiveUrl = "https://scrole.com",
                Technologies = "Angular, TypeScript, Node.js, REST APIs, Cloud CDN",
                Highlights = "Sub-second latency, Modern UX Architecture, Responsive Multi-Device Support",
                CreatedAt = staticDate
            },
            new Project
            {
                Id = 2,
                Slug = "odtool",
                Title = "ODTool Quotation Engine",
                Category = "Enterprise CPQ & Calculation System",
                FilterCategory = "dotnet",
                Image = "assets/img/ODTool.png",
                Gif = "assets/img/OdooTools.gif",
                Description = "Custom quotation engine and dynamic cost estimation platform engineered for Odyssey Design San Antonio client workflows.",
                Problem = "Sales teams spent over 3 hours daily on manual spreadsheet quotation calculations, resulting in calculation inconsistencies.",
                Architecture = "Developed an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with role-based permissions.",
                LiveUrl = "https://quote.odysseydesignco.com/home",
                Technologies = ".NET Core, C#, SQL Server, Angular, Azure App Services",
                Highlights = "Automated 3hr daily manual quoting, Real-time price calculation, Enterprise Role Permissions",
                CreatedAt = staticDate
            },
            new Project
            {
                Id = 3,
                Slug = "eurobank",
                Title = "Eurobank Banking Portal",
                Category = "Fintech & Secure Banking Platform",
                FilterCategory = "dotnet",
                Image = "assets/img/Eurobank.png",
                Gif = "assets/img/EUROBank.gif",
                Description = "Secure, high-availability banking portal engineered with enterprise authentication, strict compliance, and reliable account workflows.",
                Problem = "Required a bulletproof digital banking portal with high concurrency handling and strict zero-trust security standards.",
                Architecture = "Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security.",
                LiveUrl = "https://ssp.eurobank.com.cy/account/login",
                Technologies = "ASP.NET Core, C#, Security / RBAC, SQL Server, Microservices",
                Highlights = "Enterprise Security Architecture, High Concurrency, Zero-Downtime Resilience",
                CreatedAt = staticDate
            }
        );
    }
}
