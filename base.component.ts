import { Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';

@Component({
  template: ``,
  selector: ''
})
export class BaseComponent implements OnDestroy {

  private destroySubject = new Subject<void>();

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  componentDestroyed() {
    return this.destroySubject.asObservable();
  }

}
