using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Portfolio.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Certifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Issuer = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Educations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Degree = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Period = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Educations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Experiences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Period = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experiences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    FilterCategory = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Gif = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Problem = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Architecture = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    LiveUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Technologies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Highlights = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ShortDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    FullDescription = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    Deliverables = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EngagementTopic = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "Architecture", "Category", "CreatedAt", "Description", "FilterCategory", "Gif", "Highlights", "Image", "LiveUrl", "Problem", "Slug", "Technologies", "Title" },
                values: new object[,]
                {
                    { 1, "Engineered with Angular and clean TypeScript components, utilizing reactive state management and CDN edge caching.", "Interactive Web Platform", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "High-performance interactive web application built for seamless engagement, dynamic rendering, and responsive real-time data sync.", "web", "assets/img/Scrole.gif", "Sub-second latency, Modern UX Architecture, Responsive Multi-Device Support", "assets/img/scrole.png", "https://scrole.com", "The client needed a responsive, dynamic web portal capable of smooth animation flows and rapid interaction without compromising page load speeds.", "scrole", "Angular, TypeScript, Node.js, REST APIs, Cloud CDN", "Scrole Web Platform" },
                    { 2, "Developed an automated calculation engine powered by .NET Core, C#, SQL Server, and an Angular frontend with role-based permissions.", "Enterprise CPQ & Calculation System", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Custom quotation engine and dynamic cost estimation platform engineered for Odyssey Design San Antonio client workflows.", "dotnet", "assets/img/OdooTools.gif", "Automated 3hr daily manual quoting, Real-time price calculation, Enterprise Role Permissions", "assets/img/ODTool.png", "https://quote.odysseydesignco.com/home", "Sales teams spent over 3 hours daily on manual spreadsheet quotation calculations, resulting in calculation inconsistencies.", "odtool", ".NET Core, C#, SQL Server, Angular, Azure App Services", "ODTool Quotation Engine" },
                    { 3, "Built on ASP.NET Core with microservices backend, Entity Framework Core, SQL Server clustering, and encrypted OAuth2/JWT security.", "Fintech & Secure Banking Platform", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Secure, high-availability banking portal engineered with enterprise authentication, strict compliance, and reliable account workflows.", "dotnet", "assets/img/EUROBank.gif", "Enterprise Security Architecture, High Concurrency, Zero-Downtime Resilience", "assets/img/Eurobank.png", "https://ssp.eurobank.com.cy/account/login", "Required a bulletproof digital banking portal with high concurrency handling and strict zero-trust security standards.", "eurobank", "ASP.NET Core, C#, Security / RBAC, SQL Server, Microservices", "Eurobank Banking Portal" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certifications");

            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropTable(
                name: "Educations");

            migrationBuilder.DropTable(
                name: "Experiences");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Services");
        }
    }
}
