import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-close',
  template: `
    <mat-icon (click)="close()">close</mat-icon>
  `,
  styles: [
    'mat-icon {font-size: 2.5rem; height: 2.5rem; width: 2.5rem; float: right; cursor: pointer;}'
  ]
})
export class DialogCloseComponent implements OnInit {

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.matDialog.closeAll();
  }
}
