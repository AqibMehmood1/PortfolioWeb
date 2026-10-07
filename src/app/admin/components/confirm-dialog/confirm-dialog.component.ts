import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ConfirmDialogOptions } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  dialogOptions: ConfirmDialogOptions | null = null;
  isOpen: boolean = false;
  private sub: Subscription | null = null;

  constructor(
    private confirmService: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.confirmService.dialogState$.subscribe(opts => {
      this.dialogOptions = opts;
      this.isOpen = !!opts;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    this.confirmService.resolve(true);
  }

  onCancel(): void {
    this.confirmService.resolve(false);
  }
}
