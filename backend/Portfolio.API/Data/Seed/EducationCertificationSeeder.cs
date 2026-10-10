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
                Institution = "Superior University · Lahore, Pakistan",
                Description = "Comprehensive curriculum covering Distributed Computing, Software Architecture, Advanced Data Structures, Relational Database Systems, Object-Oriented Design, and Software Quality Assurance.",
                DisplayOrder = 1,
                IsActive = true
            }
        };

        // Remove any old intermediate / secondary school entries
        var oldSecondary = await context.Educations.Where(e => e.Institution.Contains("Nibs")).ToListAsync();
        if (oldSecondary.Any())
        {
            context.Educations.RemoveRange(oldSecondary);
        }

        foreach (var edu in educations)
        {
            var existing = await context.Educations.FirstOrDefaultAsync(e => e.Degree == edu.Degree);
            if (existing == null)
            {
                await context.Educations.AddAsync(edu);
            }
            else
            {
                existing.Institution = edu.Institution;
                existing.Period = edu.Period;
                existing.Description = edu.Description;
            }
        }

        var certifications = new List<Certification>
        {
            new()
            {
                Title = "Microsoft Azure Solutions Architecture",
                Level = "Cloud Architecture",
                Issuer = "Microsoft Azure Ecosystem",
                Description = "Architecture of scalable multi-tenant cloud systems, microservices isolation, containerized workloads, and Azure PaaS services.",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Title = "Enterprise C# & .NET 9 Core Architecture",
                Level = "Backend Systems",
                Issuer = "Microsoft .NET Stack",
                Description = "High-throughput asynchronous programming, memory optimization, Dependency Injection, and microservices architecture.",
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Title = "ASP.NET Core WebAPI & Distributed Systems",
                Level = "High-Throughput APIs",
                Issuer = "Distributed Web Systems",
                Description = "RESTful API design, database connection pooling, distributed caching with Redis, and OAuth2/JWT security.",
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Title = "Agile Architecture & Systems Governance",
                Level = "Systems Leadership",
                Issuer = "Agile Engineering Leadership",
                Description = "Architecture roadmapping, technical debt governance, continuous integration, and secure code review standards.",
                DisplayOrder = 4,
                IsActive = true
            }
        };

        foreach (var cert in certifications)
        {
            var existing = await context.Certifications.FirstOrDefaultAsync(c => c.DisplayOrder == cert.DisplayOrder);
            if (existing == null)
            {
                await context.Certifications.AddAsync(cert);
            }
            else
            {
                existing.Title = cert.Title;
                existing.Level = cert.Level;
                existing.Issuer = cert.Issuer;
                existing.Description = cert.Description;
            }
        }

        await context.SaveChangesAsync();
    }
}
