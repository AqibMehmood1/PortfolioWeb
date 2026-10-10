using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class ExperienceSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var experiences = new List<Experience>
        {
            new()
            {
                Title = "Founder & Principal Solutions Architect",
                Period = "Feb 2024 - Present · 2 yrs+",
                Company = "NEXVOYS",
                Location = "Lahore HQ · Global Remote (US, Canada, Singapore, Cyprus)",
                Description = "Partnering directly with startups and SMB founders across the US, Canada, Singapore, and Europe to architect multi-tenant SaaS products, AI Agents, and distributed cloud applications that scale seamlessly.",
                TagsJson = JsonSerializer.Serialize(new[] { "Solutions Architecture", "AI Agents", "Multi-Tenant SaaS", "Azure", ".NET 9" }),
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Title = "Solutions Architect (Contract)",
                Period = "Jan 2024 - Present · 2 yrs+",
                Company = "Pulstech",
                Location = "Paris, France · Remote",
                Description = "Directing cloud architecture design, LLM/GenAI workflow automation integrations, and scalable infrastructure for a premier French technology enterprise.",
                TagsJson = JsonSerializer.Serialize(new[] { "AI/GenAI Workflow", "Cloud Architecture", "Scalable SaaS", "API Gateway" }),
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Title = "Solutions Architect (Contract)",
                Period = "Jan 2021 - Dec 2023 · 3 yrs",
                Company = "Odyssey Design San Antonio",
                Location = "San Antonio, TX, USA · Remote",
                Description = "Led architecture and full-stack development of dynamic quotation engines (ODTool), complex pricing algorithms, and cloud infrastructure for US clients.",
                TagsJson = JsonSerializer.Serialize(new[] { ".NET Core", "C#", "Calculation Engines", "Cloud Deployment", "Angular" }),
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Title = "Senior Full Stack Developer (.NET & Angular)",
                Period = "Apr 2018 - Dec 2020 · 2 yrs 9 mos",
                Company = "Cloudoor",
                Location = "San Francisco, CA, USA · Remote",
                Description = "Engineered scalable cloud resource management platforms, high-performance REST microservices, and reactive SPAs for enterprise US clients.",
                TagsJson = JsonSerializer.Serialize(new[] { ".NET Core", "Angular", "SQL Server", "Microservices", "Azure Cloud" }),
                DisplayOrder = 4,
                IsActive = true
            },
            new()
            {
                Title = ".NET Full Stack Developer",
                Period = "Jan 2017 - Mar 2018 · 1 yr 3 mos",
                Company = "System Nexgen",
                Location = "Lahore, Pakistan",
                Description = "Developed enterprise web applications, backend APIs, relational database schemas, and unit test suites for client projects.",
                TagsJson = JsonSerializer.Serialize(new[] { "C#", "ASP.NET MVC", "Microsoft SQL Server", "OOP Patterns" }),
                DisplayOrder = 5,
                IsActive = true
            }
        };

        foreach (var exp in experiences)
        {
            var existing = await context.Experiences.FirstOrDefaultAsync(e => e.Company == exp.Company && e.Title == exp.Title);
            if (existing == null)
            {
                await context.Experiences.AddAsync(exp);
            }
            else
            {
                existing.Period = exp.Period;
                existing.Location = exp.Location;
                existing.Description = exp.Description;
                existing.TagsJson = exp.TagsJson;
                existing.DisplayOrder = exp.DisplayOrder;
            }
        }

        // Clean up old SoftEngr Labs if exists
        var old = await context.Experiences.FirstOrDefaultAsync(e => e.Company == "SoftEngr Labs");
        if (old != null)
        {
            context.Experiences.Remove(old);
        }

        await context.SaveChangesAsync();
    }
}
