import { Injectable } from '@angular/core';
import { AppHelper } from './app-helper';
import { RoutePath, RoutesPaths } from '../routes';

// import { AppHelper } from "../app-helper";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private firstPageView = true;
  private readonly trackingTurnedOn: boolean;
  private get gtag(): any {
    return this.getWindowProperty('gtag');
  }
  private get fbq(): any {
    return this.getWindowProperty('fbq');
  }

  constructor() {
    this.trackingTurnedOn = AppHelper.isLiveProductionEnvironment();
  }

  sendPageView(path: string): void {

    if (this.firstPageView) {
      this.firstPageView = false;
      return;
    }

    setTimeout(() => {
      if (this.trackingTurnedOn) {
        this.gtag('config', 'G-RJ7XPWPP1G');
        this.gtag('config', 'UA-52808031-9');
        if (this.fbq) {
          this.fbq('track', 'PageView');
        }
      } else {
        console.log('sent pageview', location.pathname, location.href, document.title);
      }
    }, 100);
  }

  sendEvent(eventName: string, params = {}): void {
    setTimeout(() => {
      if (this.trackingTurnedOn) {
        this.gtag('event', eventName, params);
      } else {
        console.log('sendEvent', eventName, params);
      }
    }, 1000);
  }

  setSeoTags(route: RoutePath, latestUrlPath: string): void {
    // console.log('setSeoTags route', route);
    const defaultData = RoutesPaths.Home.data;
    setTimeout(() => {
      const h1s = document.getElementsByTagName('h1');
      const alternateTitle = route && h1s.length ? h1s[0].textContent : defaultData.title;
      document.getElementsByTagName('title')[0].innerHTML = (route && route.data.title ? route.data.title : alternateTitle);
      const meta = document.getElementsByTagName('meta');
      for (let i = 0; i < meta.length; i ++) {
        if (meta.item(i).name === 'description') {
          meta.item(i).content = route && route.data.description ?
            route.data.description : defaultData.description;
        }
        if (meta.item(i).name === 'keywords') {
          meta.item(i).content = route && route.data.keywords ?
            route.data.keywords : defaultData.keywords;
        }
      }
      const link = document.getElementsByTagName('link');
      for (let i = 0; i < link.length; i ++) {
        if (link.item(i).rel === 'canonical') {
          link.item(i).href = window.location.protocol + '//' + window.location.hostname + latestUrlPath;
        }
      }
    }, 500); // gives time to render content to acquire h1
  }

  private getWindowProperty(property: string): () => {} {
    // @ts-ignore
    return window[property] ? window[property] : () => {};
  }
}
