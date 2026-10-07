import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ContactComponent implements OnInit, OnDestroy {
  topics: string[] = [
    'SaaS Architecture & Scale',
    'AI Agents & Workflow Automation',
    'Cloud Migration & Cost Optimization',
    'Legacy .NET & Web Modernization',
    'Fractional Solutions Architect'
  ];

  selectedTopic: string = 'SaaS Architecture & Scale';
  isSubmitting: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private msgTimeout: any = null;

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

  ngOnDestroy(): void {
    if (this.msgTimeout) {
      clearTimeout(this.msgTimeout);
    }
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
    if (this.msgTimeout) clearTimeout(this.msgTimeout);
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.contactForm.name.trim() || !this.contactForm.email.trim() || !this.contactForm.message.trim()) {
      this.errorMessage = 'Please complete all required fields (Full Name, Work Email, and Message).';
      this.msgTimeout = setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
      return;
    }

    this.isSubmitting = true;
    this.api.submitContactInquiry({
      name: this.contactForm.name.trim(),
      email: this.contactForm.email.trim(),
      phone: this.contactForm.phone.trim(),
      company: this.contactForm.company.trim(),
      subject: this.contactForm.subject.trim(),
      techStack: this.selectedTopic,
      message: this.contactForm.message.trim()
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const sender = this.contactForm.name.trim();
        this.successMessage = res.message || `Thank you, ${sender}! Your message has been received. I will respond within 24 hours. 🚀`;
        this.portfolioService.showToast(`Thank you, ${sender}! Message sent successfully. 🚀`);
        
        // Clear all form fields on success
        this.contactForm = {
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: `Topic: ${this.selectedTopic}`,
          message: ''
        };

        // Auto-dismiss alert message after 5 seconds
        this.msgTimeout = setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Unable to send your message at this moment. Please try again or reach out directly via WhatsApp / Email.';
        this.msgTimeout = setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }
}
