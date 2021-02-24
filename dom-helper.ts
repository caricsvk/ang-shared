import { Observable, Subject } from 'rxjs';

export class DomHelper {
  static scrollTo(element: HTMLElement, offset: number, duration: number): Observable<unknown> {
    const start = element.scrollTop;
    const change = offset - start;
    const increment = 20;
    let currentTime = 0;
    const subject = new Subject();
    const animateScroll = () => {
      currentTime += increment;
      element.scrollTop = DomHelper.easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        subject.complete();
      }
    };
    animateScroll();
    return subject.asObservable();
  }

  static isElementInViewport(element: HTMLElement, fully = true): boolean {
    if (! (element instanceof Element)) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    const top = rect.top >= 0;
    const left = rect.left >= 0;
    const bottom = rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    const right = rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    return fully ? top && left && bottom && right : top && left;
  }

  private static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}
