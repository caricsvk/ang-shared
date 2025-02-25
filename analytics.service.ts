import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppHelper } from './app-helper';

@Injectable({
  providedIn: 'root'
})
export abstract class AnalyticsService {

  private firstPageView = true;
  private static readonly LOCAL_STORAGE_STARTTIME_KEY = 'milo_analytics_service_id';

  private get gtag(): any {
    return this.getWindowProperty('gtag');
  }

  private get fbq(): any {
    return this.getWindowProperty('fbq');
  }

  protected abstract getApiPath(): string;

  constructor(
    protected httpClient: HttpClient
  ) {
  }

  sendPageView(gaIds: string[], other?: any): void {
    if (environment.production && this.firstPageView) {
      this.firstPageView = false;
      const width = window.innerWidth || document.documentElement?.clientWidth || document.body.clientWidth;
      const height = window.innerHeight|| document.documentElement?.clientHeight|| document.body.clientHeight;
      this.log('pageview', {first: true, width, height, other});
      return;
    }

    setTimeout(() => {
      try {
        if (environment.production) {
          this.log('pageview', {first: false, other});
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
        if (environment.production) {
          this.log(eventName, params);
          this.gtag('event', eventName, params);
        } else {
          // console.log('sendEvent', eventName, params);
        }
      } catch (e) {
        console.warn('caught sendEvent', e);
      }
    }, 1000);
  }

  async log(eventName: string, customParams = {}) {
    const params = new HttpParams().set('url', location.href);
    const firstEncounterTime = this.getFirstEncounterTime();
    let message = 'AnalyticsService.log customParams initialization failed';
    try {
      message = customParams.toString();
    } catch (e) { } // suppressed
    try {
      message = JSON.stringify(customParams, AppHelper.getCircularReplacer());
    } catch (e) { } // suppressed
    try {
      return await this.httpClient.post(
        this.getApiPath() + `log/event`, `initialized: ${firstEncounterTime}; event: ${eventName}; ${message}`,
        {params}
      ).toPromise();
    } catch (e) { // suppressed to prevent recursion
      console.error("caught analyticsService.log error", e)
      return null;
    }
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

  private getFirstEncounterTime() {
    try {
      let time = window.localStorage.getItem(AnalyticsService.LOCAL_STORAGE_STARTTIME_KEY);
      if (!time) {
        time = new Date().getTime().toString(10);
        window.localStorage.setItem(AnalyticsService.LOCAL_STORAGE_STARTTIME_KEY, time);
      }
      return time;
    } catch (e) {
      return 'undefined';
    }
  }
}
