import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.initTyped();
    this.initScrollReveal();
    this.initNavbarScroll();
    this.initBackToTop();
  }

  private initNavbarScroll(): void {
    const onScroll = (): void => {
      const scrollY = window.scrollY;
      const visible = scrollY > 300;
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
    const viewportMid = window.innerHeight * 0.5;
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
          'SaaS & Cloud Architect',
          'AI Agents & GenAI Specialist',
          'Full Stack Engineer (9+ Years)',
          '.NET Core & C# Architect',
          'Angular & React Developer',
          'Azure & AWS Cloud Optimization',
          'Microservices & High Scale Systems',
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
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
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
    link.href = '/assets/Bilal_CV.pdf';  // Path to the PDF file
    link.download = 'Bilal_CV.pdf';     // Default name of the file to be downloaded
    link.click();
  }

  scrole: string = 'https://scrole.com';
  ODTool: string = 'https://quote.odysseydesignco.com/home';
  Linkcenter: string = 'http://www.links.center/';
  Eurobank: string = 'https://ssp.eurobank.com.cy/account/login';
  Cloudoor: string = 'https://cloudoor.com/';
  Medikea: string = 'https://www.medikea.co.tz/';

  copyscrole(): void {
    navigator.clipboard.writeText(this.scrole).then(() => {
      // Optional: Display a message or toast notification
      alert('scrole Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyODTool(): void {
    navigator.clipboard.writeText(this.ODTool).then(() => {
      // Optional: Display a message or toast notification
      alert('ODTool Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyLinkcenter(): void {
    navigator.clipboard.writeText(this.Linkcenter).then(() => {
      // Optional: Display a message or toast notification
      alert('Linkcenter Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyEurobank(): void {
    navigator.clipboard.writeText(this.Eurobank).then(() => {
      // Optional: Display a message or toast notification
      alert('Eurobank Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyCloudoor(): void {
    navigator.clipboard.writeText(this.Cloudoor).then(() => {
      // Optional: Display a message or toast notification
      alert('Cloudoor Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyMedikea(): void {
    navigator.clipboard.writeText(this.Medikea).then(() => {
      // Optional: Display a message or toast notification
      alert('Medikea Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  openWhatsApp() {
    // Construct the URL to open WhatsApp with a pre-filled message
    const url = `https://wa.me/${this.phoneNumber}`;
    window.open(url, '_blank');
  }

  
}
