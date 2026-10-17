import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  itemHighlight?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogStateSubject = new Subject<ConfirmDialogOptions | null>();
  dialogState$: Observable<ConfirmDialogOptions | null> = this.dialogStateSubject.asObservable();
  private resolveCallback: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmDialogOptions | string): Promise<boolean> {
    let dialogOpts: ConfirmDialogOptions;
    
    if (typeof options === 'string') {
      dialogOpts = {
        title: 'Confirm Action',
        message: options,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
      };
    } else {
      dialogOpts = {
        title: options.title || 'Confirm Action',
        message: options.message,
        itemHighlight: options.itemHighlight,
        confirmText: options.confirmText || 'Delete',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'danger',
        icon: options.icon
      };
    }

    return new Promise<boolean>((resolve) => {
      this.resolveCallback = resolve;
      this.dialogStateSubject.next(dialogOpts);
    });
  }

  resolve(value: boolean): void {
    if (this.resolveCallback) {
      this.resolveCallback(value);
      this.resolveCallback = null;
    }
    this.dialogStateSubject.next(null);
  }
}
