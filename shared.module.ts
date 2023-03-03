import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { HorizontalScrollComponent } from './horizontal-scroll/horizontal-scroll.component';
import { EmailSubscriptionComponent } from './email-subscription/email-subscription.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { ResizableDirective } from './resizable.directive';
import { DialogCloseComponent } from './dialog-close/dialog-close.component';
import { BaseComponent } from './base.component';
import { DeferLoadDirective } from './defer-load.directive';
import { VideoComponent } from './video/video.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    HorizontalScrollComponent,
    EmailSubscriptionComponent,
    DialogCloseComponent,
    ResizableDirective,
    DeferLoadDirective,
    VideoComponent
  ],
  declarations: [
    BaseComponent,
    ConfirmationDialogComponent,
    HorizontalScrollComponent,
    EmailSubscriptionComponent,
    DialogCloseComponent,
    ResizableDirective,
    DeferLoadDirective,
    VideoComponent
  ]
})
export class SharedModule { }


