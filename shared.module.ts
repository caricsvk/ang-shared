import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HorizontalScrollComponent } from './horizontal-scroll/horizontal-scroll.component';
import { EmailSubscriptionComponent } from './email-subscription/email-subscription.component';
import { ResizableDirective } from './resizable.directive';
import { DialogCloseComponent } from './dialog-close/dialog-close.component';
import { BaseComponent } from './base.component';
import { DeferLoadDirective } from './defer-load.directive';
import { VideoComponent } from './video/video.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    CommonModule,
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


