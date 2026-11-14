import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ServiceItem } from '../../models/portfolio.model';

export interface AccordionService {
  id?: number;
  index: string;
  indexTag?: string;
  num?: string;
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
  servicesAccordion: AccordionService[] = [
    {
      index: '//01',
      title: 'SaaS Product Architecture',
      shortDesc: 'Multi-tenant foundations, tenant data isolation, subscription billing, and elastic cloud scaling.',
      bullets: [
        'Multi-Tenant Database Schema Partitioning',
        'Stripe & Subscription Billing Workflows',
        'Elastic Cloud Auto-Scaling & CDN Edge',
        'Granular RBAC Security & Audit Logs'
      ],
      image: '/assets/img/services/saas-architecture.jpg',
      route: '/services'
    },
    {
      index: '//02',
      title: 'AI Agents & Automation',
      shortDesc: 'Autonomous LLM tool-calling agents, enterprise RAG vector retrieval, and intelligent workflow pipelines.',
      bullets: [
        'Autonomous Task & Reasoning Agents',
        'Enterprise RAG with Vector Databases',
        'LangChain & Semantic Kernel Pipelines',
        'Document Parsing & Automated Data Workflows'
      ],
      image: '/assets/img/services/ai-agents-automation.jpg',
      route: '/services'
    },
    {
      index: '//03',
      title: 'Cloud Cost Optimization',
      shortDesc: 'Infrastructure audits, containerization, and workload rightsizing that cut operating costs by up to 25%.',
      bullets: [
        'Up to 25% Cloud Cost Reduction',
        'Azure & AWS Compute Rightsizing',
        'Docker Containerization & Kubernetes',
        'Distributed In-Memory Redis Caching'
      ],
      image: '/assets/img/services/cloud-optimization.jpg',
      route: '/services'
    },
    {
      index: '//04',
      title: 'Legacy Modernization & Microservices',
      shortDesc: 'Upgrading legacy monolithic architectures into high-throughput, cloud-native microservices and reactive SPAs.',
      bullets: [
        'Monolith to Microservices Roadmap',
        'Legacy Architecture Modernization',
        'Sub-Second Response Time Optimization',
        'High-Throughput WebAPI & gRPC Contracts'
      ],
      image: '/assets/img/services/dotnet-modernization.jpg',
      route: '/services'
    },
    {
      index: '//05',
      title: 'Fractional CTO & Advisory',
      shortDesc: 'Senior technical leadership for startups and SMBs preparing to raise, scale, or hire engineering teams.',
      bullets: [
        'Technical Due Diligence & Roadmap',
        'Engineering Hiring & Code Review Standards',
        'Tech Stack Evaluation & Framework Selection',
        'Executive & Board Technical Advisory'
      ],
      image: '/assets/img/services/fractional-cto.jpg',
      route: '/services'
    }
  ];

  constructor(public portfolioService: PortfolioService, private router: Router) {
    this.portfolioService.accordionServices$.subscribe(items => {
      if (items && items.length > 0) {
        this.servicesAccordion = items;
      }
    });
  }

  isSectionVisible(sectionKey: string): boolean {
    return this.portfolioService.isSectionVisible('services', sectionKey);
  }

  getSection(sectionKey: string) {
    return this.portfolioService.getSection('services', sectionKey);
  }

  get customSections() {
    return this.portfolioService.getCustomSections('services');
  }

  getSectionCards(sectionKey: string) {
    return this.portfolioService.getSectionCards('services', sectionKey);
  }

  toggleServiceAccordion(index: number): void {
    this.activeServiceIndex = this.activeServiceIndex === index ? -1 : index;
  }

  selectService(service: ServiceItem): void {
    this.router.navigate(['/contact'], { queryParams: { topic: service.engagementTopic } });
  }
}
