import { Component, Input } from '@angular/core';
import { MgInterceptorHeaders, MiloHttpInterceptor } from '../http.interceptor';
import { finalize } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-email-subscription',
  templateUrl: './email-subscription.component.html',
  styleUrls: ['./email-subscription.component.scss']
})
export class EmailSubscriptionComponent {

  @Input() title = 'Get notified about releases and new features.';
  @Input() bottomText = '';
  @Input() buttonText = 'Subscribe';

  isSavingInProgress = false;
  savingResponse = '';
  user: User = {
    email: ''
  };
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private http: HttpClient) {
  }

  subscribe(): void {
    if (this.emailFormControl.invalid) {
      return;
    }
    const headers = MiloHttpInterceptor.getHeaders(
      MgInterceptorHeaders.EXCLUDE_FROM_COUNTING_REQUESTS_IN_PROGRESS,
      MgInterceptorHeaders.PREVENT_DEFAULT_CANCELLATION,
      MgInterceptorHeaders.PREVENT_DEFAULT_ERROR_HANDLING
    );
    const params = new HttpParams().set('email', this.user.email);
    this.http.post('/api/user/subscribe', {}, {headers, params})
      .pipe(finalize(() => this.isSavingInProgress = false))
      .subscribe(() => this.savingResponse = 'Thank you for subscription.',
        (error) => this.savingResponse = error.status === 409 ? 'You were already subscribed :).' :
          'An unexpected error occurred, please try again later or message us at contact@dboard.app.');
  }

}

interface User {
  email: string;
}
