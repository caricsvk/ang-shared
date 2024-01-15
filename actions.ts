import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

export class BasicAction {
  message = '';
  status: null | -2 | number = null; // - 2 = progress
  type: string;

  setStatus(status: -2 | number) {
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
      this.status = -2;
      this.data = await deferred;
      this.status = 200;
    } catch (e: any) {
      this.status = e instanceof HttpErrorResponse ? e.status : 500;
      throw e;
    }
    return this.data;
  }
}

export class DeferredActions<T> extends BasicAction {

  private updates: Subject<DeferredActions<T>>;

  initialCount = 0;
  done = 0;
  succeeded: T[] = [];
  failed: any[] = [];

  set(deferred: Promise<T>[], parallelMax = 10) {
    this.updates = new BehaviorSubject<DeferredActions<T>>(this);
    this.initialCount = deferred.length;
    this.done = 0;
    this.succeeded = [];
    this.failed = [];

    this.runDeferred(deferred, parallelMax);
    return this.updates.asObservable();
  }

  isCompleted() {
    return this.done === this.initialCount;
  }

  private async runDeferred(deferred: Promise<T>[], parallelMax: number) {
    const inProgress: Promise<any>[] = [];
    for (const defer of deferred) {
      while (inProgress.length >= parallelMax) {
        await inProgress.shift();
      }
      inProgress.push(this.processDefer(defer));
    }
  }

  private async processDefer(defer: Promise<T>) {
    try {
      const response = await defer;
      this.succeeded.push(response);
    } catch (e) {
      this.failed.push(e);
    }
    this.done ++;
    this.updates.next(this);
    if (this.done == this.initialCount) {
      this.setStatus(this.succeeded.length == this.initialCount ? 200 : 500);
      this.updates.complete();
    }
  }
}

export type TypingAction = false | 'typing' | 'saving' | 'done';
