import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private firstPageView = true;
  private get gtag(): any {
    return this.getWindowProperty('gtag');
  }
  private get fbq(): any {
    return this.getWindowProperty('fbq');
  }

  constructor() {
  }

  sendPageView(gaIds: string[]): void {

    if (this.firstPageView) {
      this.firstPageView = false;
      return;
    }

    setTimeout(() => {
      try {
        if (environment.production) {
          gaIds.forEach(id => this.gtag('config', id));
          if (this.fbq) {
            this.fbq('track', 'PageView');
          }
        } else {
          console.warn('caught sendPageView', gaIds, location.pathname, location.href, document.title);
        }
      } catch (e) {
        // console.warn('caught sendPageView', e);
      }
    }, 100);
  }

  sendEvent(eventName: string, params = {}): void {
    setTimeout(() => {
      try {
        if (environment.productionDomain) {
          this.gtag('event', eventName, params);
        } else {
          // console.log('sendEvent', eventName, params);
        }
      } catch (e) {
        console.warn('caught sendEvent', e);
      }
    }, 1000);
  }

  // setSeoTags(route: RoutePath, latestUrlPath: string): void {
  //   // console.log('setSeoTags route', route);
  //   const defaultData = RoutesPaths.Home.data;
  //   setTimeout(() => {
  //     const h1s = document.getElementsByTagName('h1');
  //     const alternateTitle = route && h1s.length ? h1s[0].textContent : defaultData.title;
  //     document.getElementsByTagName('title')[0].innerHTML = (route && route.data.title ? route.data.title : alternateTitle);
  //     const meta = document.getElementsByTagName('meta');
  //     for (let i = 0; i < meta.length; i ++) {
  //       if (meta.item(i).name === 'description') {
  //         meta.item(i).content = route && route.data.description ?
  //           route.data.description : defaultData.description;
  //       }
  //       if (meta.item(i).name === 'keywords') {
  //         meta.item(i).content = route && route.data.keywords ?
  //           route.data.keywords : defaultData.keywords;
  //       }
  //     }
  //     const link = document.getElementsByTagName('link');
  //     for (let i = 0; i < link.length; i ++) {
  //       if (link.item(i).rel === 'canonical') {
  //         link.item(i).href = window.location.protocol + '//' + window.location.hostname + latestUrlPath;
  //       }
  //     }
  //   }, 500); // gives time to render content to acquire h1
  // }

  private getWindowProperty(property: string): () => {} {
    // @ts-ignore
    return window[property] ? window[property] : () => {};
  }
}
