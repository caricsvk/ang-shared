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

  async set(deferred: Promise<T>) {
    try {
      this.status = 'progress';
      this.data = await deferred;
      this.status = 200;
    } catch (e: any) {
      const error = e as HttpErrorResponse;
      this.status = error.status;
      throw e;
    }
  }
}

export type TypingAction = false | 'typing' | 'saving' | 'done';
