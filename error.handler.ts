import { ErrorHandler } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export class MiloErrorHandler implements ErrorHandler {

  private errorsSubject = new Subject<Error>();
  private errorSubscriptionExists = false;

  handleError(error: Error): void {
    this.errorsSubject.next(error);
    if (!this.errorSubscriptionExists) {
      console.error('uncaught error', error);
    }
  }

  getErrors(): Observable<Error> {
    return this.errorsSubject.asObservable().pipe(tap(() => this.errorSubscriptionExists = true));
  }

}

const miloErrorHandler = new MiloErrorHandler();
export const miloErrorHandlerSingletonFactory = () => miloErrorHandler;
