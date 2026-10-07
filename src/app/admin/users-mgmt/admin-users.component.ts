import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    this.adminApi.getAdminUsers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.portfolioService.showToast('Failed to load admin users.');
        this.cdr.detectChanges();
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
      this.portfolioService.showToast('Username and Email are required.');
      return;
    }

    if (!this.isEdit && !this.userForm.password) {
      this.portfolioService.showToast('Password is required for new users.');
      return;
    }

    if (this.isEdit) {
      this.adminApi.updateAdminUser(this.userForm.id, {
        email: this.userForm.email,
        fullName: this.userForm.fullName,
        role: this.userForm.role,
        isActive: this.userForm.isActive,
        password: this.userForm.password || undefined
      }).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('User updated successfully.');
            this.showModal = false;
            this.loadUsers();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Update failed.')
      });
    } else {
      this.adminApi.createAdminUser(this.userForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('User created successfully.');
            this.showModal = false;
            this.loadUsers();
          }
        },
        error: (err) => this.portfolioService.showToast(err.error?.message || 'Create failed.')
      });
    }
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
      this.adminApi.deleteAdminUser(u.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolioService.showToast('User deactivated/deleted successfully.');
            this.loadUsers();
          }
        },
        error: () => this.portfolioService.showToast('Failed to delete user.')
      });
    }
  }
}
