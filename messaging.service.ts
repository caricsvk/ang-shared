import { Injectable, TemplateRef, Type } from '@angular/core';
import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog/confirmation-dialog.component';
import { DialogPosition, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

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
    component: Type<any> | TemplateRef<any>, data: any = null, config: MatDialogConfig = new MiloDialogConfig()
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

export class MiloDialogConfig extends MatDialogConfig {

  override width = '90%';
  override maxWidth = '800px';
  override minHeight = '400px';
  override maxHeight = '94vh';
  override panelClass = 'milo-overlay-pane';
  override data: any;
  override backdropClass = 'milo-backdrop-class';

  withMaxWidth(maxWidth: string) {
    this.maxWidth = maxWidth;
    return this;
  }
}
