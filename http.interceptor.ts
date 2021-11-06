import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';

export class MiloHttpInterceptor implements HttpInterceptor {

  private terminateRequestsSubject = new Subject();
  private numberOfRequestsInProgress = 0;
  private numberOfRequestsInProgressSubject = new Subject<number>();
  private errorsResponsesSubject = new Subject<HttpErrorResponse>();

  constructor() {
  }

  static getHeaders(...interceptorHeaders: MgInterceptorHeaders[]): HttpHeaders {
    return this.addHeaders(new HttpHeaders(), ...interceptorHeaders);
  }

  static addHeaders(httpHeaders: HttpHeaders, ...interceptorHeaders: MgInterceptorHeaders[]): HttpHeaders {
    interceptorHeaders.forEach(header => httpHeaders = httpHeaders.set(header, 'true'));
    return httpHeaders;
  }

  getNumberOfRequestsInProgress(): Observable<number> {
    return this.numberOfRequestsInProgressSubject.asObservable();
  }

  getErrorsResponses(): Observable<HttpErrorResponse> {
    return this.errorsResponsesSubject.asObservable();
  }

  terminatePendingRequests(): void {
    this.terminateRequestsSubject.next(null);
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let observableRequest = next.handle(httpRequest);
    const hasHeader = (header: MgInterceptorHeaders) => httpRequest.headers.has(header);

    if (!hasHeader(MgInterceptorHeaders.EXCLUDE_FROM_COUNTING_REQUESTS_IN_PROGRESS)) {
      this.numberOfRequestsInProgressSubject.next(++this.numberOfRequestsInProgress);
    }

    if (!hasHeader(MgInterceptorHeaders.PREVENT_DEFAULT_CANCELLATION)) {
      observableRequest = observableRequest.pipe(takeUntil(this.terminateRequestsSubject));
    }

    if (!hasHeader(MgInterceptorHeaders.PREVENT_DEFAULT_ERROR_HANDLING)) {
      observableRequest = observableRequest.pipe(catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error instanceof HttpErrorResponse) {
          this.errorsResponsesSubject.next(error);
        }
        return throwError(error);
      }));
    }

    if (!hasHeader(MgInterceptorHeaders.EXCLUDE_FROM_COUNTING_REQUESTS_IN_PROGRESS)) {
      observableRequest = observableRequest.pipe(finalize(() =>
        this.numberOfRequestsInProgressSubject.next(--this.numberOfRequestsInProgress)
      ));
    }

    return observableRequest;
  }

}

export enum MgInterceptorHeaders {
  PREVENT_DEFAULT_ERROR_HANDLING = 'prevent-default-error-handling',
  PREVENT_DEFAULT_CANCELLATION = 'prevent-default-cancellation',
  EXCLUDE_FROM_COUNTING_REQUESTS_IN_PROGRESS = 'exclude-from-counting'
}


const miloHttpInterceptor = new MiloHttpInterceptor();
export const miloHttpInterceptorSingletonFactory = () => miloHttpInterceptor;
