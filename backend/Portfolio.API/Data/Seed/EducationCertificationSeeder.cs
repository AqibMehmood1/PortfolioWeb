using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class EducationCertificationSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var educations = new List<Education>
        {
            new()
            {
                Degree = "Bachelor of Science in Computer Software Engineering",
                Period = "2014 - 2018",
                Institution = "Superior University / Superior College · Lahore, Pakistan",
                Description = "Comprehensive curriculum covering Distributed Computing, Software Architecture, Advanced Data Structures, Relational Database Systems, Object-Oriented Design, and Software Quality Assurance.",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Degree = "Higher Secondary Intermediate (FSc Pre-Engineering)",
                Period = "2012 - 2014",
                Institution = "Nibs College",
                Description = "Concentrations in Mathematics, Physics, Logic, and Analytical Reasoning.",
                DisplayOrder = 2,
                IsActive = true
            }
        };

        foreach (var edu in educations)
        {
            if (!await context.Educations.AnyAsync(e => e.Institution == edu.Institution && e.Degree == edu.Degree))
            {
                await context.Educations.AddAsync(edu);
            }
        }

        var certifications = new List<Certification>
        {
            new()
            {
                Title = "Solutions Architecture & AI/GenAI Integration",
                Level = "Executive Level Competency",
                Issuer = "SaaS & Cloud Platforms",
                Description = "Architectural competency in multi-tenant SaaS engineering, LLM orchestration, autonomous agent design, and distributed cloud computing.",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Title = "Enterprise C# & .NET Core Architecture",
                Level = "Professional Mastery",
                Issuer = "Microsoft Technology Stack",
                Description = "Deep mastery in modern C# asynchronous patterns, memory optimization, Dependency Injection, and microservices architecture.",
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Title = "ASP.NET Core WebAPI & Entity Framework Core",
                Level = "Enterprise Specialization",
                Issuer = "Enterprise Web & Backend Systems",
                Description = "RESTful API design, database connection pooling, query optimization, and RBAC authentication security.",
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Title = "Scrum & Agile Business Delivery",
                Level = "SDLC Leadership",
                Issuer = "Agile Software Development",
                Description = "Sprint management, technical backlog governance, architectural roadmapping, and continuous integration delivery.",
                DisplayOrder = 4,
                IsActive = true
            }
        };

        foreach (var cert in certifications)
        {
            if (!await context.Certifications.AnyAsync(c => c.Title == cert.Title))
            {
                await context.Certifications.AddAsync(cert);
            }
        }

        await context.SaveChangesAsync();
    }
}
