# NEXVOYS Platform - Complete Project File Structure

This document outlines the architectural organization of the **NEXVOYS Platform**, structured logically from the **Main Project**, through the **Frontend Application**, and down into the **Backend Web API**.

---

## 🌳 Architectural Tree

```text
PortfolioWeb/ (MAIN PROJECT ROOT)
│
├── package.json                               # Root orchestration scripts (npm start, npm run build)
├── .editorconfig                              # Editor code formatting standard
├── .gitignore                                 # Git exclusion rules
├── README.md                                  # Project overview & quick start
├── PROJECT_STRUCTURE.md                       # Complete file structure documentation
│
├── 📁 frontend/                               # Angular 19 Client SPA
│   ├── angular.json                           # Angular CLI workspace build & asset configuration
│   ├── package.json                           # Frontend scripts & npm package dependencies
│   ├── tsconfig.json                          # TypeScript compiler settings
│   ├── tsconfig.app.json                      # Application-specific TypeScript compilation
│   │
│   ├── 📁 src/                                # Source code root
│   │   ├── index.html                         # Host HTML document
│   │   ├── main.ts                            # Angular bootstrap entrypoint
│   │   ├── styles.css                         # Global CSS & design system tokens
│   │   ├── favicon.ico                        # Website favicon
│   │   ├── robots.txt                         # Search crawler rules
│   │   ├── sitemap.xml                        # SEO XML sitemap
│   │   ├── types.d.ts                         # Ambient TypeScript declarations
│   │   │
│   │   ├── 📁 environments/                   # Environment configurations
│   │   │   ├── environment.ts                 # Local dev (API: http://localhost:5175/api)
│   │   │   └── environment.prod.ts            # Production API configuration
│   │   │
│   │   ├── 📁 assets/                         # Static media assets
│   │   │   ├── Bilal_CV.pdf                   # Principal Architect Curriculum Vitae
│   │   │   └── nexvoys/                       # Official branding graphics
│   │   │       ├── black-logo.png             # Dark brand header logo
│   │   │       ├── white-logo.png             # Light footer brand logo
│   │   │       └── nex-fav.png                # Brand favicon
│   │   │
│   │   └── 📁 app/                            # Angular application modules & components
│   │       ├── app.component.ts               # Root component (global navigation & state logic)
│   │       ├── app.component.html             # Master layout shell (Navbar, Viewport, Footer)
│   │       ├── app.component.css              # Master layout styling
│   │       ├── app.routes.ts                  # Routing definitions (Public routes + Admin child routes)
│   │       ├── app.config.ts                  # Providers (HttpClient, Animations, Interceptors)
│   │       │
│   │       ├── 📁 core/                       # Infrastructure & security
│   │       │   ├── 📁 guards/
│   │       │   │   └── auth.guard.ts          # Protects /admin/* routes via JWT check
│   │       │   └── 📁 interceptors/
│   │       │       └── auth.interceptor.ts    # Injects Bearer token into admin API calls
│   │       │
│   │       ├── 📁 services/                   # Frontend services & API clients
│   │       │   ├── portfolio.service.ts       # Central UI state, profile data, toast alerts
│   │       │   ├── portfolio-api.service.ts   # Public API calls (Settings, Inquiries, Chat)
│   │       │   ├── admin-api.service.ts       # Admin CMS calls (Full CRUD across all modules)
│   │       │   └── confirm-dialog.service.ts  # Reusable confirmation modal state
│   │       │
│   │       ├── 📁 models/                     # TypeScript domain interfaces
│   │       │   └── portfolio.model.ts         # Profile, Projects, Services, Inquiries, Stacks
│   │       │
│   │       ├── 📁 components/                 # Shared public interactive widgets
│   │       │   ├── 📁 modern-contact-form/    # Inbound lead form with stack selector & uploads
│   │       │   │   ├── modern-contact-form.component.ts
│   │       │   │   ├── modern-contact-form.component.html
│   │       │   │   └── modern-contact-form.component.css
│   │       │   └── 📁 chatbot/                # Floating AI solutions architect & lead intake
│   │       │       ├── chatbot.component.ts
│   │       │       ├── chatbot.component.html
│   │       │       └── chatbot.component.css
│   │       │
│   │       ├── 📁 pages/                      # Public client-facing pages
│   │       │   ├── 📁 home/                   # Hero, Services, Projects, Marquee, Contact
│   │       │   ├── 📁 about/                  # Company history, philosophy, leadership
│   │       │   ├── 📁 services/               # Full enterprise solutions & accordion pillars
│   │       │   ├── 📁 projects/               # Delivered case studies & portfolios
│   │       │   ├── 📁 expertise/              # Technical domain capabilities (AI, SaaS, Cloud)
│   │       │   ├── 📁 contact/                # Direct consultation booking & channels
│   │       │   ├── 📁 dynamic-page/           # Dynamic CMS-driven pages from database
│   │       │   ├── 📁 privacy/                # Privacy policy
│   │       │   ├── 📁 terms/                  # Terms & conditions
│   │       │   └── 📁 not-found/              # 404 error page
│   │       │
│   │       └── 📁 admin/                      # Enterprise Admin CMS Portal (/admin/*)
│   │           ├── 📁 login/                  # SuperAdmin secure login interface
│   │           ├── 📁 layout/                 # Admin master shell (Sidebar, Header, Breadcrumbs)
│   │           ├── 📁 dashboard/              # Metrics overview, lead counters, quick shortcuts
│   │           ├── 📁 inquiries-mgmt/         # Inbound leads inbox, status updates & file downloads
│   │           ├── 📁 projects-mgmt/          # Portfolio case studies CRUD editor
│   │           ├── 📁 services-mgmt/          # Architectural services & accordion pillars CRUD
│   │           ├── 📁 pages-mgmt/             # Dynamic page builder & section editor
│   │           ├── 📁 technologies-mgmt/      # Tech stack radar & catalog management
│   │           ├── 📁 experience-mgmt/        # Work experiences & university education CRUD
│   │           ├── 📁 testimonials-mgmt/      # Client reviews & industry domains CRUD
│   │           ├── 📁 media-mgmt/             # Uploaded file vault & asset URL manager
│   │           ├── 📁 seo-mgmt/               # Route-by-route meta tags & OpenGraph editor
│   │           ├── 📁 settings/               # Website branding, email, phone, location & socials
│   │           ├── 📁 users-mgmt/             # Admin user credentials & role permissions
│   │           ├── 📁 audit-logs-mgmt/        # Security & modification audit trail
│   │           ├── 📁 home-mgmt/              # Homepage hero headlines & ticker editor
│   │           ├── 📁 about-mgmt/             # About page narratives & metrics editor
│   │           └── 📁 components/             # Admin UI widgets (Confirm Dialog, Modals)
│
└── 📁 backend/                                # ASP.NET Core 9 Web API
    ├── Portfolio.slnx                         # Solution descriptor
    │
    └── 📁 Portfolio.API/                      # Web API Project
        ├── Program.cs                         # Application entrypoint, DI, Swagger, JWT, CORS, Pipeline
        ├── Portfolio.API.csproj               # Project dependencies (EF Core, MailKit, MimeKit, BCrypt)
        ├── appsettings.json                   # Production config (SQL Server connection, SmtpSettings, JWT)
        ├── appsettings.Development.json       # Development config
        │
        ├── 📁 Controllers/                    # REST API Controllers
        │   │
        │   ├── ── Public Website Endpoints ──
        │   ├── AboutController.cs             # GET /api/about
        │   ├── ChatController.cs              # POST /api/chat (AI Assistant conversations)
        │   ├── ContactController.cs           # POST /api/contact & /api/contact/upload (Emails dispatch)
        │   ├── ExperienceController.cs        # GET /api/experience, /api/experience/education
        │   ├── HealthController.cs            # GET /api/health
        │   ├── HomeController.cs              # GET /api/home
        │   ├── PagesController.cs             # GET /api/pages (Dynamic CMS pages)
        │   ├── ProjectsController.cs          # GET /api/projects
        │   ├── SeoController.cs               # GET /api/seo
        │   ├── ServicesController.cs          # GET /api/services, /api/services/accordion
        │   ├── SettingsController.cs          # GET /api/settings (Brand, Email, Phone, Socials)
        │   ├── TechnologiesController.cs      # GET /api/technologies (Tech radar)
        │   ├── TestimonialsController.cs      # GET /api/testimonials, /api/testimonials/industries
        │   │
        │   └── 📁 Admin/                      # Protected CMS Controllers ([Authorize])
        │       ├── AdminAuthController.cs     # Login, RefreshToken, Profile
        │       ├── AdminDashboardController.cs# KPI stats & summaries
        │       ├── AdminInquiriesController.cs# Lead statuses (New, Read, Contacted, Closed)
        │       ├── AdminPagesController.cs    # Page builder & sections
        │       ├── AdminProjectsController.cs # Case studies CRUD
        │       ├── AdminServicesController.cs # Services CRUD
        │       ├── AdminTechnologiesController.cs # Tech stack CRUD
        │       ├── AdminExperienceController.cs   # Career & education CRUD
        │       ├── AdminTestimonialsController.cs # Client reviews CRUD
        │       ├── AdminAboutController.cs    # About section CRUD
        │       ├── AdminHomeController.cs     # Home hero & stats CRUD
        │       ├── AdminMediaController.cs    # Media gallery & file uploads
        │       ├── AdminSeoController.cs      # SEO tags CRUD
        │       ├── AdminSettingsController.cs # Global settings CRUD
        │       ├── AdminUsersController.cs    # Admin users CRUD
        │       └── AdminAuditLogsController.cs# Audit logs inspection
        │
        ├── 📁 Services/                       # Business & Infrastructure Services
        │   ├── EmailService.cs                # MailKit SMTP dispatch (Applicant confirmation & Leadership dossier)
        │   ├── IEmailService.cs               # Email service contract
        │   ├── ChatbotService.cs              # Intent classification & AI response engine
        │   ├── IChatbotService.cs             # Chatbot service contract
        │   ├── TokenService.cs                # JWT security token & refresh token issuer
        │   ├── FileStorageService.cs          # Local attachment validation, storage & URL generator
        │   └── AuditLogService.cs             # Immutable audit log recording
        │
        ├── 📁 Entities/                       # EF Core Database Entities
        │   ├── BaseEntity.cs                  # Common fields (Id, CreatedAt, UpdatedAt, IsActive)
        │   └── CoreEntities.cs                # Domain models (ContactInquiry, AdminUser, Project, etc.)
        │
        ├── 📁 DTOs/                           # Data Transfer Objects
        │   ├── SmtpSettings.cs                # Host, Port, SSL, Username, Password, AdminNotificationEmails
        │   ├── AuthDTOs.cs                    # LoginRequest, TokenResponse, UserDto
        │   └── PublicAndAdminDTOs.cs          # Data contracts for Public & Admin endpoints
        │
        ├── 📁 Data/                           # Database Context & Seeders
        │   ├── ApplicationDbContext.cs        # EF Core DbContext with relational mapping & indexes
        │   └── 📁 Seed/                       # Initial data seeders (Pages, Settings, Admin user)
        │
        ├── 📁 Middleware/                     # Pipeline Middlewares
        │   └── ExceptionMiddleware.cs         # Centralized error handler & unified JSON envelope
        │
        └── 📁 wwwroot/                        # Static file server
            └── 📁 uploads/                    # Uploaded inquiry attachments & media
```

---

## 🚀 Execution & Port Mapping

| Component | Technology | Default Port | Entrypoint |
| :--- | :--- | :--- | :--- |
| **Frontend** | Angular 19 (Standalone) | `http://localhost:4200` | `npm start` |
| **Backend API** | ASP.NET Core 9 | `http://localhost:5175` | `dotnet run --project backend/Portfolio.API` |
| **Database** | SQL Server 2022 | `205.209.125.182:1433` | Database: `nexvoys-platform-db` |
| **Mail Server** | Plesk MailEnable (SSL) | `mail.nexvoys.com:465` | Mailbox: `info@nexvoys.com` |
