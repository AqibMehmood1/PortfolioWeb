import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ServiceItem } from '../../models/portfolio.model';

export interface AccordionService {
  index: string;
  title: string;
  shortDesc: string;
  bullets: string[];
  image: string;
  route: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  activeServiceIndex: number = 0;

  readonly servicesAccordion: AccordionService[] = [
    {
      index: '//01',
      title: 'AI & Data Innovation',
      shortDesc: 'Build Intelligent Products Using AI, Machine Learning, And Advanced Data Engineering.',
      bullets: [
        'Agent As a Service',
        'AI Product Development',
        'Autonomous Agentic AI',
        'Enterprise RAG & Vector DBs'
      ],
      image: 'assets/img/project-3.jpg',
      route: '/expertise'
    },
    {
      index: '//02',
      title: 'Custom Software Development',
      shortDesc: 'End-to-End Scalable Architectures Tailored for Startup MVPs & High-Growth SaaS Platforms.',
      bullets: [
        'Multi-Tenant SaaS Platforms',
        'Automated Stripe Billing',
        'Dynamic Subdomain Routers',
        'Clean RBAC Data Isolation'
      ],
      image: 'assets/img/project-1.jpg',
      route: '/services'
    },
    {
      index: '//03',
      title: 'Enterprise .NET & CPQ Engines',
      shortDesc: 'Modern High-Throughput C# / .NET 9 WebAPIs, Microservices, and Dynamic Pricing Systems.',
      bullets: [
        '.NET 9 & ASP.NET WebAPI',
        'Dynamic CPQ Price Calculation',
        'Asynchronous Event-Bus',
        'Monolith to Microservices Modernization'
      ],
      image: 'assets/img/project-2.jpg',
      route: '/services'
    },
    {
      index: '//04',
      title: 'Cloud Scaling & Cost Optimization',
      shortDesc: 'Resilient Azure & AWS Cloud Infrastructure Engineered to Cut Operating Bills by up to 25%.',
      bullets: [
        '25% Cloud Cost Reduction',
        'Kubernetes & Docker Clusters',
        'Zero-Downtime Blue/Green CI/CD',
        'Distributed In-Memory Redis Caching'
      ],
      image: 'assets/img/project-1.jpg',
      route: '/services'
    }
  ];

  constructor(public portfolioService: PortfolioService, private router: Router) {}

  toggleServiceAccordion(index: number): void {
    this.activeServiceIndex = this.activeServiceIndex === index ? -1 : index;
  }

  selectService(service: ServiceItem): void {
    this.router.navigate(['/contact'], { queryParams: { topic: service.engagementTopic } });
  }
}
