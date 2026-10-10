import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Admin imports
import { authGuard } from './core/guards/auth.guard';
import { AdminLoginComponent } from './admin/login/admin-login.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { AdminPagesComponent } from './admin/pages-mgmt/admin-pages.component';
import { AdminSettingsComponent } from './admin/settings/admin-settings.component';
import { AdminHomeComponent } from './admin/home-mgmt/admin-home.component';
import { AdminAboutComponent } from './admin/about-mgmt/admin-about.component';
import { AdminServicesComponent } from './admin/services-mgmt/admin-services.component';
import { AdminProjectsComponent } from './admin/projects-mgmt/admin-projects.component';
import { AdminTechnologiesComponent } from './admin/technologies-mgmt/admin-technologies.component';
import { AdminExperienceComponent } from './admin/experience-mgmt/admin-experience.component';
import { AdminTestimonialsComponent } from './admin/testimonials-mgmt/admin-testimonials.component';
import { AdminInquiriesComponent } from './admin/inquiries-mgmt/admin-inquiries.component';
import { AdminMediaComponent } from './admin/media-mgmt/admin-media.component';
import { AdminSeoComponent } from './admin/seo-mgmt/admin-seo.component';
import { AdminUsersComponent } from './admin/users-mgmt/admin-users.component';
import { AdminAuditLogsComponent } from './admin/audit-logs-mgmt/admin-audit-logs.component';

export const routes: Routes = [
  // Public Portfolio Routes
  { path: '', component: HomeComponent, title: 'Nexvoys — SaaS & AI Architecture Partner for Startups and SMBs' },
  { path: 'about', component: AboutComponent, title: 'About Nexvoys | Founder-Led Architecture Partner' },
  { path: 'expertise', component: ExpertiseComponent, title: 'Technical Radar & Architecture Disciplines | Nexvoys' },
  { path: 'services', component: ServicesComponent, title: 'Services & Solutions Architecture | Nexvoys' },
  { path: 'projects', component: ProjectsComponent, title: 'Case Studies & Selected Work | Nexvoys' },
  { path: 'contact', component: ContactComponent, title: 'Book an Architecture Call | Nexvoys' },
  { path: 'privacy', component: PrivacyComponent, title: 'Privacy Policy | Nexvoys' },
  { path: 'terms', component: TermsComponent, title: 'Terms of Service | Nexvoys' },
  { path: 'p/:slug', component: DynamicPageComponent, title: 'Nexvoys Platform' },

  // Admin Authentication
  { path: 'admin/login', component: AdminLoginComponent, title: 'Admin Authentication | NEXVOYS CMS' },

  // Protected Admin CMS Panel
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, title: 'CMS Dashboard | NEXVOYS' },
      { path: 'pages', component: AdminPagesComponent, title: 'Pages & Sections Architecture | NEXVOYS CMS' },
      { path: 'settings', component: AdminSettingsComponent, title: 'Website Settings | NEXVOYS CMS' },
      { path: 'home', component: AdminHomeComponent, title: 'Homepage Content | NEXVOYS CMS' },
      { path: 'about', component: AdminAboutComponent, title: 'About Content | NEXVOYS CMS' },
      { path: 'services', component: AdminServicesComponent, title: 'Services & Pillars | NEXVOYS CMS' },
      { path: 'projects', component: AdminProjectsComponent, title: 'Projects & Case Studies | NEXVOYS CMS' },
      { path: 'technologies', component: AdminTechnologiesComponent, title: 'Tech Radar & Stacks | NEXVOYS CMS' },
      { path: 'skills', component: AdminTechnologiesComponent, title: 'Tech Stacks | NEXVOYS CMS' },
      { path: 'experience', component: AdminExperienceComponent, title: 'Career & Experience | NEXVOYS CMS' },
      { path: 'testimonials', component: AdminTestimonialsComponent, title: 'Client Reviews & Proof | NEXVOYS CMS' },
      { path: 'inquiries', component: AdminInquiriesComponent, title: 'Leads & Inquiries | NEXVOYS CMS' },
      { path: 'media', component: AdminMediaComponent, title: 'Media Asset Vault | NEXVOYS CMS' },
      { path: 'seo', component: AdminSeoComponent, title: 'SEO & Social Tags | NEXVOYS CMS' },
      { path: 'users', component: AdminUsersComponent, title: 'Admin Users | NEXVOYS CMS' },
      { path: 'audit-logs', component: AdminAuditLogsComponent, title: 'Audit Trail Logs | NEXVOYS CMS' }
    ]
  },

  { path: '**', component: NotFoundComponent, title: '404 - Page Not Found | Nexvoys' }
];
