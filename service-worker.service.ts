import { DeferredAction } from './actions';
import { BehaviorSubject } from 'rxjs';
import { EntityService } from "./entity.service";

export abstract class ServiceWorkerService<P extends PushSubscription, T extends ServiceWorkerMessage<P>> {

  // chrome://serviceworker-internals/
  private registration: ServiceWorkerRegistration;
  private pushSubscriptionSubject = new BehaviorSubject<P>(null);
  private pushSubscriptionAction: DeferredAction<P>;

  constructor(
    private entityService: EntityService<P>,
  ) {
    try {
      if ('serviceWorker' in navigator) {
        // ,  {scope: '/'}
        navigator.serviceWorker.register(this.getServiceWorkerScriptPath()).then(registration => {
          console.log('Service Worker Register requested...', registration);
          this.registration = registration;
        });
        navigator.serviceWorker.addEventListener(
          'message', (event: MessageEvent<T>) => this.processMessage(event)
        );
      }
    } catch (e) {
      console.warn('caught ServiceWorkerService initialization error:', e);
    }
  }

  protected abstract getLocalStoragePushSubscriptionKey(): string;
  protected abstract getServiceWorkerScriptPath(): string;

  protected processMessage(event: MessageEvent<T>): void {
    // console.log('Message from service worker:', event.data);
    if (event.data.removePushSubscription) {
      this.removeServerPushSubscription(event.data.pushSubscription).then(
        () => this.pushSubscriptionSubject.next(null)
      );
    } else if (event.data.browserSubscription) {
      const browserSubscription = event.data.browserSubscription;
      const pushSubscription = event.data.pushSubscription;
      pushSubscription.auth = browserSubscription.auth;
      pushSubscription.p256dh = browserSubscription.p256dh;
      pushSubscription.endpoint = browserSubscription.endpoint;
      this.updateServerPushSubscription(pushSubscription).then(
        subscription => this.pushSubscriptionSubject.next(subscription)
      );
    }
    if (event.data.navigateTo) {
      location.href = event.data.navigateTo;
    }
  }

  saveLocalPushSubscriptionId(id: string) {
    localStorage.setItem(this.getLocalStoragePushSubscriptionKey(), id);
  }

  getLocalPushSubscriptionId() {
    return localStorage.getItem(this.getLocalStoragePushSubscriptionKey());
  }

  async updatePushSubscription(subscription: P) {
    // console.log('sendSubscriptionToServer', subscription);
    this.pushSubscriptionAction = new DeferredAction<P>();
    this.pushSubscriptionAction.status = -2;
    await this.updateBrowserPushSubscription(subscription);
    return this.pushSubscriptionAction;
  }

  async updateBrowserPushSubscription(subscription: P) {
    if (!("Notification" in window)) {
      // console.log('Notification is not supported.');
      throw 'Notification is not supported';
    } else if (Notification.permission === "granted") {
      // console.log('Notification permission granted.');
      this.updateNotificationsSubscription(subscription);
    } else {
      // console.log('Notification permission request.');
      //if (Notification.permission !== "denied") {
      // At last, if the user has denied notifications, and you
      // want to be respectful there is no need to bother them anymore.
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.updateNotificationsSubscription(subscription);
      } else {
        // console.warn('notification permission failed: ', permission);
        throw 'Permission error: ' + permission;
      }
    }
  }

  private removeServerPushSubscription(subscription: PushSubscription) {
    this.saveLocalPushSubscriptionId('');
    return this.entityService.remove(subscription.id).toPromise();
  }

  getPushSubscription() {
    try {
      const localPushSubscriptionId = this.getLocalPushSubscriptionId();
      if (localPushSubscriptionId) {
        this.entityService.find(localPushSubscriptionId).subscribe(
          pushSubscription => this.pushSubscriptionSubject.next(pushSubscription)
        );
      }
    } catch (e) {
      // supressed
    }
    return this.pushSubscriptionSubject.asObservable();
  }

  private async updateServerPushSubscription(subscription: P) {
    // console.log('putPushSubscription', subscription);
    const localPushSubscriptionId = this.getLocalPushSubscriptionId();
    try {
      subscription.id = parseInt(localPushSubscriptionId);
    } catch (e) {
      subscription.id = null;
    }
    subscription = await this.pushSubscriptionAction.set(
      this.entityService.save(subscription).toPromise()
    );
    if (!localPushSubscriptionId) {
      this.saveLocalPushSubscriptionId(subscription.id + '');
    }
    return subscription;
  }

  refresh() {
    // console.log('refreshing service worker, can: ', !!this.registration);
    if (this.registration) {
      this.registration.update();
      return true;
    }
    return false;
  }

  private updateNotificationsSubscription(pushSubscription: PushSubscription) {
    if (this.registration) {
      // Register the service worker// Send a message to the service worker
      try {
        this.registration.active.postMessage(
          { pushSubscription, unsubscribe: !pushSubscription.isSubscribed() }
        );
      } catch(error) {
        console.error('Service Worker registration failed:', error);
        alert('Service Worker registration failed: ' + error);
      }
    }
  }

}

export class ServiceWorkerMessage<P extends PushSubscription> {
  navigateTo: string;
  removePushSubscription: boolean;
  pushSubscription: P;
  browserSubscription: {
    endpoint: string,
    auth: string,
    p256dh: string
  }
}

export abstract class PushSubscription {
  id: number;
  auth: string;
  p256dh: string;
  endpoint: string;

  public abstract isSubscribed(): boolean;
}
