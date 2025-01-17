import { Injectable } from '@angular/core';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogOnCloseResult
} from './confirmation-dialog/confirmation-dialog.component';
import { AppHelper } from './app-helper';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private openedDialogErrorCode: number = null;
  private unauthorizedEventSubject = new Subject<ConfirmationDialogOnCloseResult>();

  constructor(
    private dialog: MatDialog
  ) { }

  public showHttpError(errorCode: number): void {

    if (this.openedDialogErrorCode === errorCode) {
      return; // do not open same error multiple times / layered;
    }

    let data;
    switch (errorCode) {
      case 401:
        data = new ConfirmationDialogData('You are not logged in', 'You have to be logged in to perform this action.',
          'Log In', 'Nevermind');
        break;
      case 403:
        data = new ConfirmationDialogData('Access denied', 'Your permissions are not properly set to see this page.', 'Go Back', null);
        break;
    }
    if (errorCode >= 500) {
      data = new ConfirmationDialogData('Unexpected server error',
        'We are sorry, an unexpected server error has occurred. Dialog will auto-close in 8 seconds.', 'Reload App', 'Ignore');
    }

    if (!data) {
      return;
    }

    const dialog = this.dialog.open(ConfirmationDialogComponent, {id: 'errorDialog', width: '400px', data});
    dialog.afterClosed().subscribe(
      (response: ConfirmationDialogOnCloseResult) => {
        this.openedDialogErrorCode = null;
        switch (errorCode) {
          case 401:
            this.unauthorizedEventSubject.next(response);
            break;
          case 403:
            history.back();
            break;
          default:
            if (response && response.confirmed) {
              location.reload();
            }
        }
      });

    if (errorCode >= 400) {
      setTimeout(() => dialog.close(), 1000*10);
    }

    this.openedDialogErrorCode = errorCode;
  }

  unauthorizedError(): Observable<ConfirmationDialogOnCloseResult> {
    return this.unauthorizedEventSubject.asObservable();
  }

  showError(error: Error, title = 'An unexpected error occurred'): void {
    console.error('caught JS error', error);
    // if (! AppHelper.isLiveProductionEnvironment()) {
      // alert(title + ':\n' + error.message + '\n' + error.stack);
    // }
  }

}
