import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AdminApiService, AdminUserDto } from '../../services/admin-api.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: AdminUserDto[] = [];
  loading: boolean = true;
  saving: boolean = false;
  showModal: boolean = false;
  isEdit: boolean = false;
  showPassword: boolean = false;

  userForm = {
    id: 0,
    username: '',
    email: '',
    fullName: '',
    role: 'Admin',
    password: '',
    isActive: true
  };

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private adminApi: AdminApiService,
    private portfolioService: PortfolioService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminApi.getAdminUsers().pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: () => {
        this.portfolioService.showError('Failed to load administrator accounts.', 'Load Error');
      }
    });
  }

  openCreate(): void {
    this.userForm = {
      id: 0,
      username: '',
      email: '',
      fullName: '',
      role: 'Admin',
      password: '',
      isActive: true
    };
    this.isEdit = false;
    this.showModal = true;
  }

  openEdit(u: AdminUserDto): void {
    this.userForm = {
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      password: '',
      isActive: u.isActive
    };
    this.isEdit = true;
    this.showModal = true;
  }

  saveUser(): void {
    if (!this.userForm.username.trim() || !this.userForm.email.trim()) {
      this.portfolioService.showWarning('Username and Email are required before saving.', 'Validation Warning');
      return;
    }

    if (!this.isEdit && !this.userForm.password) {
      this.portfolioService.showWarning('Password is required for newly created administrators.', 'Validation Warning');
      return;
    }

    this.saving = true;
    const req$ = this.isEdit
      ? this.adminApi.updateAdminUser(this.userForm.id, {
          email: this.userForm.email,
          fullName: this.userForm.fullName,
          role: this.userForm.role,
          isActive: this.userForm.isActive,
          password: this.userForm.password || undefined
        })
      : this.adminApi.createAdminUser(this.userForm);

    req$.pipe(
      timeout(15000),
      finalize(() => {
        this.saving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolioService.showSuccess(
            this.isEdit ? `Admin user "${this.userForm.username}" updated successfully!` : `Admin user "${this.userForm.username}" created successfully!`,
            this.isEdit ? 'User Updated' : 'User Created'
          );
          this.showModal = false;
          this.loadUsers();
        } else {
          this.portfolioService.showError(res.message || 'Operation failed.', 'Save Error');
        }
      },
      error: (err) => this.portfolioService.showError(err.error?.message || 'Operation failed. Please try again.', 'Save Error')
    });
  }

  async deleteUser(u: AdminUserDto): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Deactivate Admin Account',
      message: 'Are you sure you want to permanently revoke privileges for',
      itemHighlight: `${u.username} (${u.email})`,
      confirmText: 'Deactivate User',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-user-slash'
    });

    if (confirmed) {
      this.adminApi.deleteAdminUser(u.id).pipe(
        timeout(15000)
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showSuccess(`Admin user "${u.username}" deactivated successfully.`, 'User Deactivated');
            this.loadUsers();
          } else {
            this.portfolioService.showError(res.message || 'Failed to deactivate user.', 'Action Error');
          }
        },
        error: () => this.portfolioService.showError('Failed to deactivate administrator account.', 'Action Error')
      });
    }
  }
}
