import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdminApiService, AdminUserDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeClass?: string;
}

export interface NavSection {
  title: string;
  tag?: string;
  accent?: 'lime' | 'cyan' | 'purple' | 'amber' | 'rose';
  items: NavItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen: boolean = true;
  isMobile: boolean = false;
  currentUser: AdminUserDto | null = null;

  navSections: NavSection[] = [
    {
      title: 'Core Platform',
      tag: 'OPS',
      accent: 'lime',
      items: [
        { label: 'Dashboard', icon: 'fas fa-chart-pie', route: '/admin/dashboard' },
        { label: 'Inquiries & Leads', icon: 'fas fa-envelope-open-text', route: '/admin/inquiries' },
        { label: 'Website Settings', icon: 'fas fa-sliders-h', route: '/admin/settings' }
      ]
    },
    {
      title: 'Content & Pages',
      tag: 'CMS',
      accent: 'cyan',
      items: [
        { label: 'Pages & Sections', icon: 'fas fa-sitemap', route: '/admin/pages' },
        { label: 'Homepage Content', icon: 'fas fa-home', route: '/admin/home' },
        { label: 'About & Philosophy', icon: 'fas fa-user-tie', route: '/admin/about' },
        { label: 'Services & Pillars', icon: 'fas fa-cubes', route: '/admin/services' }
      ]
    },
    {
      title: 'Portfolio & Career',
      tag: 'WORK',
      accent: 'purple',
      items: [
        { label: 'Projects & Studies', icon: 'fas fa-laptop-code', route: '/admin/projects' },
        { label: 'Tech Stacks & Radar', icon: 'fas fa-layer-group', route: '/admin/technologies' },
        { label: 'Experience & Career', icon: 'fas fa-briefcase', route: '/admin/experience' },
        { label: 'Testimonials & Proof', icon: 'fas fa-star', route: '/admin/testimonials' }
      ]
    },
    {
      title: 'Media & SEO',
      tag: 'ASSETS',
      accent: 'amber',
      items: [
        { label: 'Media Library', icon: 'fas fa-images', route: '/admin/media' },
        { label: 'SEO Metadata', icon: 'fas fa-search', route: '/admin/seo' }
      ]
    },
    {
      title: 'System & Security',
      tag: 'ADMIN',
      accent: 'rose',
      items: [
        { label: 'Admin Users', icon: 'fas fa-users-cog', route: '/admin/users' },
        { label: 'Audit Logs', icon: 'fas fa-clipboard-list', route: '/admin/audit-logs' }
      ]
    }
  ];

  get navItems(): NavItem[] {
    return this.navSections.flatMap(s => s.items);
  }

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.adminApi.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadInquiriesBadge();

    // Auto-close drawer on route navigation on mobile screens
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile) {
        this.sidebarOpen = false;
      }
    });
  }

  private loadInquiriesBadge(): void {
    this.adminApi.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.newInquiries > 0) {
          const inqItem = this.findNavItem('/admin/inquiries');
          if (inqItem) {
            inqItem.badge = `${res.data.newInquiries} NEW`;
            inqItem.badgeClass = 'badge-danger';
          }
        }
      },
      error: () => {}
    });
  }

  findNavItem(route: string): NavItem | undefined {
    for (const sec of this.navSections) {
      const found = sec.items.find(i => i.route === route);
      if (found) return found;
    }
    return undefined;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 992;
      if (mobile !== this.isMobile) {
        this.isMobile = mobile;
        this.sidebarOpen = !mobile;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.adminApi.logout().subscribe({
      next: () => {
        this.portfolioService.showInfo('You have logged out of Admin CMS.', 'Signed Out');
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.adminApi.clearSession();
        this.portfolioService.showInfo('You have logged out of Admin CMS.', 'Signed Out');
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
