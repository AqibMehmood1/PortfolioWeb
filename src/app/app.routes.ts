import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Bilal Ahmad | Enterprise Solutions Architect' },
  { path: 'about', component: AboutComponent, title: 'About Bilal Ahmad | Solutions Architect & Strategy' },
  { path: 'expertise', component: ExpertiseComponent, title: 'Technical Radar & Architecture Disciplines | Bilal Ahmad' },
  { path: 'services', component: ServicesComponent, title: 'Services & Solutions Architecture | Bilal Ahmad' },
  { path: 'projects', component: ProjectsComponent, title: 'Case Studies & Delivered Systems | Bilal Ahmad' },
  { path: 'contact', component: ContactComponent, title: 'Schedule Architectural Consultation | Bilal Ahmad' },
  { path: '**', redirectTo: '' }
];
