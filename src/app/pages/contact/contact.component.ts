import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { timeout, finalize } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioApiService } from '../../services/portfolio-api.service';
import { ModernContactFormComponent } from '../../components/modern-contact-form/modern-contact-form.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModernContactFormComponent],
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
    timeline: 'Within 2-4 weeks',
    budgetRange: '$500 - $2,500 (Architecture Audit)',
    subject: 'Topic: SaaS Architecture & Scale',
    message: '',
    agreed: false
  };

  constructor(
    public portfolioService: PortfolioService,
    private api: PortfolioApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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

  isSectionVisible(sectionKey: string): boolean {
    return this.portfolioService.isSectionVisible('contact', sectionKey);
  }

  getSection(sectionKey: string) {
    return this.portfolioService.getSection('contact', sectionKey);
  }

  get customSections() {
    return this.portfolioService.getCustomSections('contact');
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
      this.portfolioService.showWarning(this.errorMessage, 'Incomplete Form');
      this.cdr.detectChanges();
      this.msgTimeout = setTimeout(() => {
        this.errorMessage = null;
        this.cdr.detectChanges();
      }, 5000);
      return;
    }

    if (!this.contactForm.agreed) {
      this.errorMessage = 'Please agree to the privacy policy to proceed.';
      this.portfolioService.showWarning(this.errorMessage, 'Privacy Agreement');
      this.cdr.detectChanges();
      this.msgTimeout = setTimeout(() => {
        this.errorMessage = null;
        this.cdr.detectChanges();
      }, 5000);
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const formattedMessage = `[Timeline: ${this.contactForm.timeline} | Budget: ${this.contactForm.budgetRange}]\n\n${this.contactForm.message.trim()}`;

    this.api.submitContactInquiry({
      name: this.contactForm.name.trim(),
      email: this.contactForm.email.trim(),
      phone: this.contactForm.phone.trim(),
      company: this.contactForm.company.trim(),
      subject: this.contactForm.subject.trim(),
      techStack: this.selectedTopic,
      message: formattedMessage
    })
    .pipe(
      timeout(15000),
      finalize(() => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        });
      })
    )
    .subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          const sender = this.contactForm.name.trim();
          this.successMessage = res.message || `Thank you, ${sender}! Your message has been received. Principal Architect Bilal will respond within 24 hours. 🚀`;
          this.portfolioService.showSuccess(`Thank you, ${sender}! Message sent successfully. 🚀`, 'Message Sent');
          
          // Clear all form fields on success
          this.contactForm = {
            name: '',
            email: '',
            phone: '',
            company: '',
            timeline: 'Within 2-4 weeks',
            budgetRange: '$500 - $2,500 (Architecture Audit)',
            subject: `Topic: ${this.selectedTopic}`,
            message: '',
            agreed: false
          };
          this.cdr.detectChanges();

          // Auto-dismiss alert message after 6 seconds
          this.msgTimeout = setTimeout(() => {
            this.ngZone.run(() => {
              this.successMessage = null;
              this.cdr.detectChanges();
            });
          }, 6000);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          let msg = 'Unable to send your message at this moment. Please try again or reach out directly via WhatsApp / Email.';
          if (err?.name === 'TimeoutError') {
            msg = 'Request timed out after 15 seconds. Please verify your connection or contact us directly.';
          } else if (err?.error?.message) {
            msg = err.error.message;
          } else if (typeof err?.error === 'string' && err.error.trim()) {
            msg = err.error;
          }
          this.errorMessage = msg;
          this.portfolioService.showError(msg, 'Submission Failed');
          this.cdr.detectChanges();

          this.msgTimeout = setTimeout(() => {
            this.ngZone.run(() => {
              this.errorMessage = null;
              this.cdr.detectChanges();
            });
          }, 6000);
        });
      }
    });
  }
}
