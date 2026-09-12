import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'NEXVOYS | Enterprise Technology Partner | SaaS & AI Systems' },
  { path: 'about', component: AboutComponent, title: 'About NEXVOYS | Technology Partner & Solutions Architecture' },
  { path: 'expertise', component: ExpertiseComponent, title: 'Technical Radar & Architecture Disciplines | NEXVOYS' },
  { path: 'services', component: ServicesComponent, title: 'Services & Solutions Architecture | NEXVOYS' },
  { path: 'projects', component: ProjectsComponent, title: 'Case Studies & Delivered Systems | NEXVOYS' },
  { path: 'contact', component: ContactComponent, title: 'Schedule Architectural Consultation | NEXVOYS' },
  { path: '**', redirectTo: '' }
];
