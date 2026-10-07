using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class TechnologiesSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var categories = new List<TechnologyCategory>
        {
            new() { Key = "ai", Label = "AI & ML", DisplayOrder = 1 },
            new() { Key = "frontend", Label = "Frontend", DisplayOrder = 2 },
            new() { Key = "backend", Label = "Backend", DisplayOrder = 3 },
            new() { Key = "lownocode", Label = "Low / No Code", DisplayOrder = 4 },
            new() { Key = "database", Label = "Database", DisplayOrder = 5 },
            new() { Key = "devops", Label = "DevOps & Cloud", DisplayOrder = 6 },
            new() { Key = "mobile", Label = "Mobile Apps", DisplayOrder = 7 }
        };

        foreach (var cat in categories)
        {
            if (!await context.TechnologyCategories.AnyAsync(c => c.Key == cat.Key))
            {
                await context.TechnologyCategories.AddAsync(cat);
            }
        }
        await context.SaveChangesAsync();

        var technologies = new List<(string Cat, string Name, string Icon, string Color)>
        {
            // AI & ML
            ("ai", "Tensorflow", "fas fa-brain", "#ff6f00"),
            ("ai", "Keras", "fas fa-cube", "#d00000"),
            ("ai", "Pytorch", "fas fa-fire", "#ee4c2c"),
            ("ai", "LangChain", "fas fa-link", "#2563eb"),
            ("ai", "Semantic Kernel", "fas fa-microchip", "#7c3aed"),
            ("ai", "Pinecone DB", "fas fa-database", "#059669"),
            ("ai", "spaCy", "fas fa-spell-check", "#0284c7"),
            ("ai", "OpenAI GPT-4o", "fas fa-robot", "#10a37f"),
            ("ai", "Claude Sonnet", "fas fa-bolt", "#d97706"),
            ("ai", "Hugging Face", "far fa-smile", "#f59e0b"),
            ("ai", "NLTK", "fab fa-python", "#3b82f6"),
            ("ai", "Lisp", "fas fa-code", "#ef4444"),

            // Frontend
            ("frontend", "Angular 17+", "fab fa-angular", "#dd0031"),
            ("frontend", "React.js", "fab fa-react", "#61dafb"),
            ("frontend", "TypeScript", "fab fa-js", "#3178c6"),
            ("frontend", "Next.js", "fas fa-forward", "#111915"),
            ("frontend", "Vue.js", "fab fa-vuejs", "#42b883"),
            ("frontend", "RxJS / NgRx", "fas fa-infinity", "#d81b60"),
            ("frontend", "Tailwind CSS", "fas fa-wind", "#06b6d4"),
            ("frontend", "Bootstrap 5", "fab fa-bootstrap", "#7952b3"),
            ("frontend", "Micro-Frontends", "fas fa-th-large", "#6366f1"),
            ("frontend", "Vite & Webpack", "fas fa-bolt", "#bd34fe"),
            ("frontend", "WebSockets", "fas fa-network-wired", "#10b981"),
            ("frontend", "Progressive Web", "fas fa-mobile-alt", "#ec4899"),

            // Backend
            ("backend", ".NET 9 / C#", "fab fa-windows", "#512bd4"),
            ("backend", "ASP.NET Core", "fas fa-server", "#512bd4"),
            ("backend", "Entity Framework", "fas fa-database", "#68217a"),
            ("backend", "Node.js", "fab fa-node-js", "#68a063"),
            ("backend", "Python APIs", "fab fa-python", "#3776ab"),
            ("backend", "Microservices Bus", "fas fa-project-diagram", "#0284c7"),
            ("backend", "REST & GraphQL", "fas fa-code-branch", "#e10098"),
            ("backend", "Clean Architecture", "fas fa-layer-group", "#059669"),
            ("backend", "SignalR Live Sync", "fas fa-broadcast-tower", "#d97706"),
            ("backend", "RabbitMQ", "fas fa-exchange-alt", "#ff6600"),
            ("backend", "gRPC High-Speed", "fas fa-bolt", "#244c5a"),
            ("backend", "C++ Modern", "fas fa-file-code", "#00599c"),

            // Low / No Code
            ("lownocode", "Bubble.io", "fas fa-soap", "#0d6efd"),
            ("lownocode", "Retool Admin", "fas fa-tools", "#0070f3"),
            ("lownocode", "Make / Integromat", "fas fa-random", "#6f42c1"),
            ("lownocode", "Zapier Automation", "fas fa-bolt", "#ff4a00"),
            ("lownocode", "Webflow", "fas fa-paint-brush", "#4353ff"),
            ("lownocode", "Power Automate", "fab fa-microsoft", "#0078d4"),

            // Database
            ("database", "SQL Server", "fas fa-database", "#cc292b"),
            ("database", "Redis Cache", "fas fa-bolt", "#dc382d"),
            ("database", "PostgreSQL", "fas fa-database", "#336791"),
            ("database", "MongoDB", "fas fa-leaf", "#47a248"),
            ("database", "Azure CosmosDB", "fas fa-globe", "#0089d6"),
            ("database", "Elasticsearch", "fas fa-search", "#005571"),
            ("database", "Sharded Schemas", "fas fa-columns", "#6366f1"),
            ("database", "AWS DynamoDB", "fab fa-aws", "#4053d6"),

            // DevOps & Cloud
            ("devops", "Microsoft Azure", "fab fa-microsoft", "#0078d4"),
            ("devops", "AWS Cloud", "fab fa-aws", "#ff9900"),
            ("devops", "Docker Engine", "fab fa-docker", "#2496ed"),
            ("devops", "Kubernetes (K8s)", "fas fa-dharmachakra", "#326ce5"),
            ("devops", "GitHub Actions", "fab fa-github", "#181717"),
            ("devops", "Cloudflare CDN", "fas fa-cloud", "#f38020"),
            ("devops", "Terraform IaC", "fas fa-cubes", "#844fba"),
            ("devops", "Cost Optimization", "fas fa-dollar-sign", "#10b981"),

            // Mobile
            ("mobile", "React Native", "fab fa-react", "#61dafb"),
            ("mobile", "Flutter / Dart", "fas fa-feather-alt", "#02569b"),
            ("mobile", "Ionic Framework", "fas fa-mobile-alt", "#3880ff"),
            ("mobile", "iOS Swift APIs", "fab fa-apple", "#000000"),
            ("mobile", "Android Kotlin", "fab fa-android", "#3ddc84"),
            ("mobile", "PWA Mobile", "fas fa-tablet-alt", "#10b981")
        };

        var allCats = await context.TechnologyCategories.ToListAsync();
        int order = 1;
        foreach (var t in technologies)
        {
            if (!await context.Technologies.AnyAsync(x => x.Name == t.Name && x.CategoryKey == t.Cat))
            {
                var catEntity = allCats.FirstOrDefault(c => c.Key == t.Cat);
                await context.Technologies.AddAsync(new Technology
                {
                    CategoryKey = t.Cat,
                    CategoryId = catEntity?.Id,
                    Name = t.Name,
                    Icon = t.Icon,
                    Color = t.Color,
                    DisplayOrder = order++,
                    IsActive = true
                });
            }
        }

        await context.SaveChangesAsync();
    }
}
