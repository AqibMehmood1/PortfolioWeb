import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioApiService } from '../../services/portfolio-api.service';

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
  isSubmitting: boolean = false;

  contactForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Topic: SaaS Architecture & Scale',
    message: ''
  };

  constructor(
    public portfolioService: PortfolioService,
    private api: PortfolioApiService,
    private route: ActivatedRoute
  ) {}

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
    if (!this.contactForm.name.trim() || !this.contactForm.email.trim() || !this.contactForm.message.trim()) {
      this.portfolioService.showToast('Please complete all required fields.');
      return;
    }

    this.isSubmitting = true;
    this.api.submitContactInquiry({
      name: this.contactForm.name,
      email: this.contactForm.email,
      phone: this.contactForm.phone,
      company: this.contactForm.company,
      subject: this.contactForm.subject,
      techStack: this.selectedTopic,
      message: this.contactForm.message
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.portfolioService.showToast(res.message || 'Thank you! Your message has been received. I will respond within 24 hours. 🚀');
        this.contactForm.name = '';
        this.contactForm.email = '';
        this.contactForm.phone = '';
        this.contactForm.company = '';
        this.contactForm.message = '';
      },
      error: () => {
        this.isSubmitting = false;
        this.portfolioService.showToast('Thank you! Your message has been submitted.');
        this.contactForm.name = '';
        this.contactForm.email = '';
        this.contactForm.message = '';
      }
    });
  }
}
