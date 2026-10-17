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
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      route: '/services'
    },
    {
      index: '//04',
      title: '.NET Modernization',
      shortDesc: 'Upgrading monolithic legacy .NET Framework applications into high-throughput .NET 9 microservices and reactive SPAs.',
      bullets: [
        'Monolith to Microservices Roadmap',
        'Legacy .NET Framework to .NET 9 Upgrade',
        'Sub-Second Response Time Optimization',
        'High-Throughput WebAPI & gRPC Contracts'
      ],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      route: '/services'
    },
    {
      index: '//05',
      title: 'Fractional CTO & Advisory',
      shortDesc: 'Senior technical leadership for startups and SMBs preparing to raise, scale, or hire engineering teams.',
      bullets: [
        'Technical Due Diligence & Roadmap',
        'Engineering Hiring & Code Review Standards',
        'Tech Stack Evaluation (.NET, Azure, Node)',
        'Executive & Board Technical Advisory'
      ],
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
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
