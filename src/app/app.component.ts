import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Typed from 'typed.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  readonly SECTION_IDS: string[] = ['home', 'about', 'skill', 'service', 'project', 'team', 'contact'];
  title = 'PortfolioWeb';
  gmail = 'bilalsoftengr@gmail.com';
  phoneNumber = '+923456466188';
  displayPhone = '+92 345 6466188';
  location = 'Lahore, Punjab, Pakistan';
  linkedinUrl = 'https://www.linkedin.com/in/bilalsoftengr/';
  upworkUrl = 'https://www.upwork.com/freelancers/~01cf247ced49045c1f?viewMode=1';
  fiverrUrl = 'https://www.fiverr.com/bilalsoftengr';

  navVisible = false;
  activeSection: string = 'home';
  private typedInstance: Typed | null = null;

  // Interactive consultation topic selector
  selectedTopic: string = 'SaaS Architecture & Scale';
  topics: string[] = [
    'SaaS Architecture & Scale',
    'AI Agents & Workflow Automation',
    'Cloud Migration & Cost Optimization',
    'Legacy .NET/Web Modernization',
    'Fractional Solutions Architect'
  ];

  // Toast notification system
  toastMessage: string | null = null;
  private toastTimeout: any = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.initTyped();
    this.initScrollReveal();
    this.initNavbarScroll();
    this.initBackToTop();
  }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
  }

  showToast(message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage = message;
    this.cdr.detectChanges();
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
      this.cdr.detectChanges();
    }, 3500);
  }

  copyText(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(`${label} copied to clipboard! ✨`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  copyEmail(): void {
    this.copyText(this.gmail, 'Email address');
  }

  copyPhone(): void {
    this.copyText(this.displayPhone, 'Phone number');
  }

  private initNavbarScroll(): void {
    const onScroll = (): void => {
      const scrollY = window.scrollY;
      const visible = scrollY > 250;
      if (visible !== this.navVisible) {
        this.navVisible = visible;
      }
      const sectionId = this.getActiveSection(scrollY);
      if (sectionId !== this.activeSection) {
        this.activeSection = sectionId;
      }
      this.cdr.detectChanges();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  private getActiveSection(_scrollY: number): string {
    const viewportMid = window.innerHeight * 0.45;
    let current = this.SECTION_IDS[0];
    for (const id of this.SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
        return id;
      }
      if (rect.top <= viewportMid) {
        current = id;
      }
    }
    return current;
  }

  private initTyped(): void {
    const el = document.querySelector('.typed-text');
    if (el) {
      this.typedInstance = new Typed('.typed-text', {
        strings: [
          'Solutions Architect',
          'SaaS | Cloud Architect',
          'AI Agents | GenAI Specialist',
          'Full Stack Engineer (9+ Years)',
          '.NET Core | C# Architect',
          'Angular | React Developer',
          'Azure | AWS Cloud Optimization',
          'Microservices | High Scale Systems',
          'Trusted Technology Partner'
        ],
        typeSpeed: 30,
        backSpeed: 25,
        backDelay: 1000,
        startDelay: 500,
        loop: true,
        showCursor: true
      });
    }
  }

  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  private initBackToTop(): void {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    const onScroll = (): void => {
      btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/Bilal_CV.pdf';
    link.download = 'Bilal_Ahmad_Solutions_Architect_CV.pdf';
    link.click();
    this.showToast('Downloading Bilal Ahmad CV... 📄');
  }

  scrole: string = 'https://scrole.com';
  ODTool: string = 'https://quote.odysseydesignco.com/home';
  Linkcenter: string = 'http://www.links.center/';
  Eurobank: string = 'https://ssp.eurobank.com.cy/account/login';
  Cloudoor: string = 'https://cloudoor.com/';
  Medikea: string = 'https://www.medikea.co.tz/';

  copyscrole(): void {
    this.copyText(this.scrole, 'Scrole link');
  }
  copyODTool(): void {
    this.copyText(this.ODTool, 'ODTool link');
  }
  copyLinkcenter(): void {
    this.copyText(this.Linkcenter, 'Linkcenter link');
  }
  copyEurobank(): void {
    this.copyText(this.Eurobank, 'Eurobank link');
  }
  copyCloudoor(): void {
    this.copyText(this.Cloudoor, 'Cloudoor link');
  }
  copyMedikea(): void {
    this.copyText(this.Medikea, 'Medikea link');
  }

  openWhatsApp(): void {
    const message = encodeURIComponent(`Hi Bilal, I visited your Solutions Architect portfolio and would like to discuss a project.`);
    const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }
}
