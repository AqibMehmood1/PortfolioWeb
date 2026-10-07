import { Component } from '@angular/core';
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
export class AdminLoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  private errorTimeout: any = null;

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {
    if (this.adminApi.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter both username/email and password.';
      this.errorTimeout = setTimeout(() => {
        this.errorMessage = '';
      }, 4000);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.adminApi.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.portfolioService.showToast('Login successful. Welcome to Admin CMS!');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please check your credentials.';
          this.errorTimeout = setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid username or password. Please try again.';
        this.errorTimeout = setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
}
