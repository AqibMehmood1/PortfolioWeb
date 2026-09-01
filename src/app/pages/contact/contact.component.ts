import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  topics: string[] = [
    'SaaS Architecture & Scale',
    'AI Agents & Workflow Automation',
    'Cloud Migration & Cost Optimization',
    'Legacy .NET & Web Modernization',
    'Fractional Solutions Architect'
  ];

  selectedTopic: string = 'SaaS Architecture & Scale';

  contactForm = {
    name: '',
    email: '',
    subject: 'Topic: SaaS Architecture & Scale',
    message: ''
  };

  constructor(public portfolioService: PortfolioService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['topic'] && this.topics.includes(params['topic'])) {
        this.selectTopic(params['topic']);
      }
    });
  }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.contactForm.subject = `Topic: ${topic}`;
  }

  copyEmail(): void {
    this.portfolioService.copyText(this.portfolioService.profile.email, 'Email address');
  }

  copyPhone(): void {
    this.portfolioService.copyText(this.portfolioService.profile.displayPhone, 'Phone number');
  }

  submitContactForm(): void {
    this.portfolioService.showToast('Thank you! Your message has been received. I will respond within 24 hours. 🚀');
    this.contactForm.name = '';
    this.contactForm.email = '';
    this.contactForm.message = '';
  }
}
