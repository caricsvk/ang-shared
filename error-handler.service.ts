import { Injectable } from '@angular/core';
import {
  ConfirmationDialogComponent, ConfirmationDialogCustomValue,
  ConfirmationDialogData,
  ConfirmationDialogOnCloseResult
} from './confirmation-dialog/confirmation-dialog.component';
import { AppHelper } from './app-helper';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable, Subject } from 'rxjs';
import { StorageService } from "../storage.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private openedDialogErrorCode: number = null;
  private unauthorizedEventSubject = new Subject<ConfirmationDialogOnCloseResult>();
  private readonly localStorageIgnoreErrorsKey = 'milo.error-handler.ignore';

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
    if (errorCode >= 500 && !this.suppressErrors()) {
      const customValue = new ConfirmationDialogCustomValue('Ignore errors', ['for next 8 hours', 'for next 24 hours', 'for next 48 hours']);
      data = new ConfirmationDialogData('Unexpected server error',
        'We are sorry, an unexpected server error has occurred. Dialog will auto-close in 8 seconds.', 'Reload App', 'Ignore', [customValue]);
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
            } else if (response && response.customValues[0].value) {
              this.suppressErrors(response.customValues[0].value);
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

  private suppressErrors(time?: 'for next 8 hours' | 'for next 24 hours' | 'for next 48 hours') {
    switch (time) {
      case "for next 8 hours":
        this.setIgnoreErrorsInHours(8);
        break;
      case "for next 24 hours":
        this.setIgnoreErrorsInHours(24);
        break;
      case "for next 48 hours":
        this.setIgnoreErrorsInHours(48);
        break;
    }
    const ignoreErrors = this.getIgnoreErrorsInHours();
    // console.log('suppressErrors', time, ignoreErrors, ignoreErrors.since && ignoreErrors.since + 0.01 * 60*60*1000 > new Date().getTime());
    return ignoreErrors.since && ignoreErrors.since + ignoreErrors.hours * 60*60*1000 > new Date().getTime();
  }

  private setIgnoreErrorsInHours(hours: number) {
    localStorage.setItem(this.localStorageIgnoreErrorsKey, JSON.stringify({ hours, since: new Date().getTime() }));
  }

  private getIgnoreErrorsInHours(): {hours: number, since: number} {
    return JSON.parse(localStorage.getItem(this.localStorageIgnoreErrorsKey) || '{}');
  }
}
