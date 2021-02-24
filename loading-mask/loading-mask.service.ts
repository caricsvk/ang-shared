import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter, debounce, distinctUntilChanged } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoadingMaskService {

  private registeredLocalMasks = new BehaviorSubject(0);
  private globalMaskDisabled = new BehaviorSubject(false);
  private globalMaskForced = new BehaviorSubject(false);
  private globalMaskShown = new BehaviorSubject(false);

  constructor(private router: Router) {
  }

  enableGlobalMask(numberOfRequests: Observable<number>) {
    const navigationStartOrEnd = (event: any) => event instanceof NavigationStart || event instanceof NavigationEnd ||
      event instanceof NavigationError;

    combineLatest(
      numberOfRequests,
      this.router.events.pipe(filter(navigationStartOrEnd)),
      this.globalMaskDisabled.asObservable(),
      this.globalMaskForced.asObservable(),
      this.registeredLocalMasks.asObservable(),
    ).subscribe(combinedValues => {
      const [ httpRequestsInProgress, lastNavigationEvent, globalMaskDisabled, globalMaskForced,
        numberOfShownLocalLoadings ] = combinedValues;

      const showGlobalMask = globalMaskForced || lastNavigationEvent instanceof NavigationStart || (!globalMaskDisabled &&
        numberOfShownLocalLoadings <= 0 && httpRequestsInProgress > 0);
      this.globalMaskShown.next(showGlobalMask);
    });
  }

  registerLocalMask() {
    this.registeredLocalMasks.next(this.registeredLocalMasks.getValue() + 1);
  }

  deregisterLocalMask() {
    this.registeredLocalMasks.next(this.registeredLocalMasks.getValue() - 1);
  }

  /**
   * call this when you want to temporarily disable global loading mask, don't forget to call enableGlobalMask after,
   * note that any initialized local mask before http request prevent showing global mask
   */
  temporarilyDisableGlobalMask() {
    this.globalMaskDisabled.next(true);
  }

  cancelTemporalGlobalMaskDisabling() {
    this.globalMaskDisabled.next(false);
  }

  isGlobalMaskShown = () => this.globalMaskShown.asObservable().pipe(distinctUntilChanged(), debounce(
    shown => interval(shown ? 500 : 100)
  ), distinctUntilChanged());
}
