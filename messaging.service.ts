import { Injectable, TemplateRef, Type } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef, LegacyTextOnlySnackBar as TextOnlySnackBar } from '@angular/material/legacy-snack-bar';
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

  showDialog(
    component: Type<any> | TemplateRef<any>, data: any = null, config = new MiloDialogConfig()
  ): MatDialogRef<any, any> {
    config.data = data;
    return this.dialog.open(component, config);
  }

  showFloatingMessage(message: string, action?: string, duration = MessageDuration.Medium,
                      verticalPosition: 'top' | 'bottom' = 'bottom'): MatSnackBarRef<TextOnlySnackBar> {
    return this.matSnackBar.open(message, action, {duration, verticalPosition});
  }
}

export enum MessageDuration {
  Short = 2000,
  Medium = 3500,
  Long = 5000
}

export class MiloDialogConfig {
  width = '90%';
  maxWidth = '800px';
  minHeight = '400px';
  maxHeight = '94%';
  panelClass = 'milo-overlay-pane';
  data: any;

  withMaxWidth(maxWidth: string) {
    this.maxWidth = maxWidth;
    return this;
  }
}
