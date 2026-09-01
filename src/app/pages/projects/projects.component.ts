import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectItem } from '../../models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  activeFilter: 'all' | 'saas' | 'dotnet' | 'web' | 'health' = 'all';

  constructor(public portfolioService: PortfolioService) {}

  get filteredProjects(): ProjectItem[] {
    if (this.activeFilter === 'all') {
      return this.portfolioService.projects;
    }
    return this.portfolioService.projects.filter(p => p.filterCategory === this.activeFilter);
  }

  setFilter(filter: 'all' | 'saas' | 'dotnet' | 'web' | 'health'): void {
    this.activeFilter = filter;
  }

  openProjectModal(project: ProjectItem): void {
    this.portfolioService.openProjectModal(project);
  }

  copyProjectLink(project: ProjectItem): void {
    this.portfolioService.copyText(project.liveUrl, `${project.title} URL`);
  }
}
