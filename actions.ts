import { HttpErrorResponse } from '@angular/common/http';

export class BasicAction {
  message = '';
  status: null | 'progress' | number = null;

  setStatus(status: 'progress' | number) {
    this.status = status;
  }

  resetStatus() {
    this.status = null;
  }

  getNotNullStatus() {
    return this.status || 0;
  }

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  }
}

export class DeferredAction<T> extends BasicAction {
  data: T;

  constructor(deferred?: Promise<T>) {
    super();
    if (deferred) {
      this.set(deferred);
    }
  }

  async set(deferred: Promise<T>) {
    try {
      this.status = 'progress';
      this.data = await deferred;
      this.status = 200;
    } catch (e: any) {
      this.status = e instanceof HttpErrorResponse ? e.status : 500;
      throw e;
    }
    return this.data;
  }
}

export type TypingAction = false | 'typing' | 'saving' | 'done';
