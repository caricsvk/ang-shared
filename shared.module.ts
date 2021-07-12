import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LoadingMaskComponent } from './loading-mask/loading-mask.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalScrollComponent } from './horizontal-scroll/horizontal-scroll.component';
import { EmailSubscriptionComponent } from './email-subscription/email-subscription.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { ResizableDirective } from './resizable.directive';
import { DialogCloseComponent } from './dialog-close/dialog-close.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    LoadingMaskComponent,
    HorizontalScrollComponent,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    EmailSubscriptionComponent,
    DialogCloseComponent,
    ResizableDirective
  ],
  declarations: [
    ConfirmationDialogComponent,
    HorizontalScrollComponent,
    LoadingMaskComponent,
    EmailSubscriptionComponent,
    DialogCloseComponent,
    ResizableDirective
  ]
})
export class SharedModule { }


