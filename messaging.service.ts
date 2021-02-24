import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private readonly duration = 2000;

  constructor(
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) { }

  showConfirmation(data: ConfirmationDialogData): MatDialogRef<unknown, any> {
    return this.dialog.open(ConfirmationDialogComponent, {width: '400px', data});
  }

  showDialog(component: Type<any>, data: any = null): MatDialogRef<any, any> {
    return this.dialog.open(component, {
      width: '90%',
      maxWidth: '800px',
      data
    });
  }

  showFloatingMessage(message: string, action: string = null, duration = MessageDuration.Medium): MatSnackBarRef<TextOnlySnackBar> {
    return this.matSnackBar.open(message, action, {duration});
  }
}

export enum MessageDuration {
  Short = 2000,
  Medium = 3500,
  Long = 5000
}
