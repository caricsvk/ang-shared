import { Injectable } from '@angular/core';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogOnCloseResult
} from './confirmation-dialog/confirmation-dialog.component';
import { AppHelper } from './app-helper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private unauthorizedEventSubject = new Subject<ConfirmationDialogOnCloseResult>();

  constructor(private dialog: MatDialog) { }

  public showHttpError(errorCode: number): void {
    let data;
    switch (errorCode) {
      case 401:
        data = new ConfirmationDialogData('Session expired', 'Log in to continue, or start from scratch not logged.',
          'Log In', 'Start from scratch');
        break;
      case 403:
        data = new ConfirmationDialogData('Access denied', 'Your permissions are not properly set to see this page.', 'Go Back', null);
        break;
      default:
        data = new ConfirmationDialogData('Unexpected server error', 'We are sorry, an unexpected server error has occurred.', 'Reload App', 'Continue');
        break;
    }

    this.dialog.open(ConfirmationDialogComponent, {id: 'errorDialog', width: '400px', data}).afterClosed().subscribe(
      (response: ConfirmationDialogOnCloseResult) => {
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
  }

  unauthorizedError(): Observable<ConfirmationDialogOnCloseResult> {
    return this.unauthorizedEventSubject.asObservable();
  }

  showError(error: Error, title = 'An unexpected error occurred'): void {
    console.error('caught JS error', error);
    if (! AppHelper.isLiveProductionEnvironment()) {
      // alert(title + ':\n' + error.message + '\n' + error.stack);
    }
  }

}
