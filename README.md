# NEXVOYS Dynamic Portfolio & Enterprise CMS

A production-ready, database-driven Content Management System (CMS) and Portfolio built with **Angular 18**, **ASP.NET Core 9 Web API**, and **Microsoft SQL Server**.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Angular 18 Frontend                  │
│                                                        │
│  [ Public Website: / ]    │   [ Admin CMS: /admin/* ]  │
│  - Live REST Bindings     │   - Executive Dashboard    │
│  - Reactive UI Streams    │   - Full Content CRUD      │
│  - Exact UI/UX Preserved  │   - JWT Auth & RBAC        │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
                │ REST API (JSON)        │ Bearer JWT
                ▼                        ▼
┌────────────────────────────────────────────────────────┐
│                   .NET 9 Web API                       │
│                                                        │
│  - Controllers (Public & Admin API segregation)        │
│  - Business Logic & DTO Layer                          │
│  - Idempotent Database Seeder                          │
│  - JWT & Refresh Token Service                         │
│  - Local File Storage & MIME Validation                │
│  - Immutable Audit Log Middleware & Trail              │
│  - Centralized Global Exception Handler                │
└───────────────────────────┬────────────────────────────┘
                            │ EF Core 9
                            ▼
┌────────────────────────────────────────────────────────┐
│                   SQL Server 2022                      │
│                                                        │
│  - Database: Portfolio                                 │
│  - Source of Truth for all Website Content             │
│  - Foreign Keys, Unique Indexes, Auditing              │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Exact Portfolio Content Default Seeding (Idempotent)**
   - All real projects (Scrole, ODTool, Eurobank, Cloudoor, Medikea, LinksCenter), services, technologies, career experiences, certifications, testimonials, and metadata were extracted directly from the static Angular application.
   - Idempotent startup seeder checks for existing records before inserting. If an administrator edits content via the Admin Panel, restarting the backend will **never overwrite** or duplicate records.

2. **Full-Featured Angular Admin Panel (`/admin/*`)**
   - **Dashboard**: Live real-time statistics (projects, capabilities, technologies, inquiries, testimonials, storage files, recent activity timeline).
   - **Website Settings**: Site branding, founder details, availability badge, resume links, contact info, social links, footer bio, copyright.
   - **Homepage Manager**: Hero headlines, highlighted gradient phrases, primary/secondary CTA targets, statistics, ticker marquee items.
   - **About & Philosophy**: Bio narratives, engineering philosophy quote, metrics.
   - **Services & Pillars**: Core services and interactive accordion pillar CRUD.
   - **Projects & Case Studies**: Portfolio case studies, live demo URLs, GitHub repositories, metrics, technology tags.
   - **Tech Radar & Stacks**: Categorized technology radar (AI/ML, Frontend, Backend, Low-Code, Database, DevOps, Mobile) with proficiency levels and progress indicators.
   - **Career & Credentials**: Work experiences, university degrees, and verified certifications.
   - **Testimonials & Proof**: Client reviews, star ratings, and industry domain highlights.
   - **Leads & Inquiries**: Incoming client consultations with status tracking (`New`, `Read`, `Contacted`, `Closed`), filter toolbar, and internal admin notes.
   - **Media Vault**: File upload validation, direct copyable URLs, preview grid, and size calculation.
   - **SEO & Social**: Meta titles, descriptions, canonical URLs, robots directives, and Open Graph tags per route.
   - **Admin Users**: Role-based access control (`SuperAdmin`, `Admin`), password hashing with BCrypt.
   - **Audit Logs**: Immutable log trail of administrative creations, modifications, and deletions.

3. **Public Dynamic Website**
   - Preserves 100% of the original sleek cyberpunk / modern dark-mode design, responsive layouts, animations, and typography.
   - Dynamically consumes REST endpoints via `PortfolioService` with instant fallback and zero broken assets.

---

## 🔐 Default Admin Credentials

- **URL**: `http://localhost:4200/admin/login`
- **Username**: `admin`
- **Password**: `Test123*6Secure!`
- **Role**: `SuperAdmin`

---

## 🛠️ Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+ & npm](https://nodejs.org/)
- [Microsoft SQL Server](https://www.microsoft.com/sql-server) (Local or remote instance)

### 1. Database Connection
Update the connection string in `backend/Portfolio.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-0I8RCHH;Database=Portfolio;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

### 2. Run the .NET 9 Backend
```bash
cd backend/Portfolio.API
dotnet run --urls "http://localhost:5175"
```
- **Swagger Documentation**: `http://localhost:5175/swagger`
- **Public API Root**: `http://localhost:5175/api`
- **Admin API Root**: `http://localhost:5175/api/admin`

### 3. Run the Angular Frontend
```bash
npm install
npm start
```
- **Public Site**: `http://localhost:4200/`
- **Admin Panel**: `http://localhost:4200/admin/`

---

## 📡 API Endpoints Overview

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/settings` | Global branding and contact settings |
| `GET` | `/api/home` | Hero banner, metrics, ticker marquee |
| `GET` | `/api/about` | Bio narrative, philosophy quotes, stats |
| `GET` | `/api/services` | Active core services |
| `GET` | `/api/services/accordion` | Interactive capability pillars |
| `GET` | `/api/projects` | Case studies (supports `?filter=dotnet\|saas\|web`) |
| `GET` | `/api/projects/featured` | Featured homepage projects |
| `GET` | `/api/technologies` | Grouped technology matrix |
| `GET` | `/api/experience` | Career history |
| `GET` | `/api/testimonials` | Client endorsements |
| `POST` | `/api/contact` | Submit consultation inquiry |

### Admin Endpoints (`Bearer <JWT>` required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin user |
| `GET` | `/api/admin/dashboard` | Executive KPI metrics |
| `GET/PUT` | `/api/admin/settings` | Update global settings |
| `GET/PUT` | `/api/admin/home` | Manage hero & home content |
| `GET/PUT` | `/api/admin/about` | Manage About section |
| `GET/POST/PUT/DELETE` | `/api/admin/services` | Services CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/projects` | Projects & Case Studies CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/technologies` | Tech Radar CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/experience` | Career & Education CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/testimonials` | Client Reviews CRUD |
| `GET/PUT/DELETE` | `/api/admin/inquiries` | Leads & Status management |
| `GET/POST/DELETE` | `/api/admin/media` | Media Vault & File upload |
| `GET/PUT` | `/api/admin/seo` | Route SEO meta tags |
| `GET/POST/PUT/DELETE` | `/api/admin/users` | Admin team management |
| `GET` | `/api/admin/audit-logs` | Immutable audit trails |

---

## 🔒 Security Best Practices
- **Password Hashing**: BCrypt with unique cryptographic salt.
- **JWT Authentication**: Short-lived HS256 JWT access tokens paired with revocable refresh tokens.
- **Role-Based Access**: Strict `[Authorize(Roles = "SuperAdmin")]` on user and security endpoints.
- **File Upload Validation**: Extension & MIME whitelist (JPEG, PNG, GIF, WebP, SVG, PDF) with size limits (15MB).
- **SQL Injection Prevention**: Parameterized queries via Entity Framework Core.
