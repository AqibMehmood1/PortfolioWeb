import { Component, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnDestroy {
  username = '';
  password = '';
  loading = false;
  showPassword = false;
  errorMessage = '';
  private errorTimeout: any = null;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    if (this.adminApi.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter both username/email and password.';
      this.cdr.detectChanges();
      this.errorTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        });
      }, 5000);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminApi.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.loading = false;
          if (res.success) {
            this.portfolioService.showToast('Login successful. Welcome to Admin CMS!');
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.errorMessage = res.message || 'Login failed. Please check your credentials.';
            this.cdr.detectChanges();
            this.errorTimeout = setTimeout(() => {
              this.ngZone.run(() => {
                this.errorMessage = '';
                this.cdr.detectChanges();
              });
            }, 5000);
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;

          let msg = 'Invalid username or password. Please try again.';
          if (err?.error?.message) {
            msg = err.error.message;
          } else if (typeof err?.error === 'string' && err.error.trim()) {
            msg = err.error;
          } else if (err?.status === 401) {
            msg = 'Invalid username or password.';
          } else if (err?.status === 0) {
            msg = 'Backend server is unreachable. Please verify the API is running.';
          } else if (err?.message) {
            msg = err.message;
          }

          this.errorMessage = msg;
          this.cdr.detectChanges();

          this.errorTimeout = setTimeout(() => {
            this.ngZone.run(() => {
              this.errorMessage = '';
              this.cdr.detectChanges();
            });
          }, 6000);
        });
      }
    });
  }
}
