import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class ConfirmationDialogData {
  constructor(
    public title?: string,
    public subtitle?: string,
    public okButton: string | null = 'Ok',
    public cancelButton: string | null = 'Cancel',
    public customValues: ConfirmationDialogCustomValue[] = []
  ) {}
}

export class ConfirmationDialogCustomValue {
  value: any;
  constructor(
    public label: string,
    public values?: any[]
  ) {}
  getType(): string | null {
    if (this.values === undefined || this.values === null) {
      return 'text';
    } else if (this.values.length > 2) {
      return 'select';
    } else if (this.values.length === 2) {
      return this.values.includes(true) && this.values.includes(false) ? 'checkbox' : 'select';
    }
    return null;
  }
}

export class ConfirmationDialogOnCloseResult {
  constructor(
    public confirmed: boolean,
    public customValues: ConfirmationDialogCustomValue[] = []
  ) {}
}


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(public dialog: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
    if (!(this.data instanceof ConfirmationDialogData)) {
      this.data = Object.assign(new ConfirmationDialogData(), this.data);
    }
  }
  close(confirmation: boolean): void {
    this.dialog.close(new ConfirmationDialogOnCloseResult(confirmation, this.data.customValues));
  }
}
