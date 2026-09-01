import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Typed from 'typed.js';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectItem, ServiceItem } from '../../models/portfolio.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  featuredProjects: ProjectItem[] = [];
  featuredServices: ServiceItem[] = [];
  private typedInstance: Typed | null = null;

  constructor(public portfolioService: PortfolioService) {
    this.featuredProjects = this.portfolioService.projects.slice(0, 3);
    this.featuredServices = this.portfolioService.services.slice(0, 3);
  }

  ngAfterViewInit(): void {
    const el = document.querySelector('.typed-text');
    if (el) {
      this.typedInstance = new Typed('.typed-text', {
        strings: [
          'Enterprise Solutions Architect',
          'Scalable SaaS | Multi-Tenancy',
          'Autonomous AI Agents | GenAI',
          'Azure | AWS Cloud Cost Tuning',
          '.NET 9 | C# | Microservices',
          'Fractional CTO | Technology Advisor'
        ],
        typeSpeed: 35,
        backSpeed: 25,
        backDelay: 1400,
        startDelay: 400,
        loop: true,
        showCursor: true
      });
    }
  }

  ngOnDestroy(): void {
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }
  }

  openProjectModal(project: ProjectItem): void {
    this.portfolioService.openProjectModal(project);
  }

  copyProjectLink(project: ProjectItem): void {
    this.portfolioService.copyText(project.liveUrl, `${project.title} URL`);
  }
}
