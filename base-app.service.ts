import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { stringToEnum } from './app-helper';

@Injectable({
  providedIn: 'root'
})
export class BaseAppService {

  private deviceSubject = new ReplaySubject<DeviceType>(1);

  private breakpointToDeviceTypeMap = new Map([
    [Breakpoints.XSmall, DeviceType.Mobile],
    [Breakpoints.Small, DeviceType.Mobile],
    [Breakpoints.Medium, DeviceType.Tablet],
    [Breakpoints.Large, DeviceType.Pc],
    [Breakpoints.XLarge, DeviceType.Pc],
  ]);

  constructor(
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      const query = Object.keys(result.breakpoints).find(query => result.breakpoints[query])
      const deviceType = this.breakpointToDeviceTypeMap.get(query ?? '') ?? DeviceType.Pc;
      // console.log('breakpoint', result, 'query:', query, 'nextDevice:', deviceType);
      this.deviceSubject.next(deviceType);
    });
  }

  setDeviceTypeAsClassTo(element: HTMLElement) {
    this.getDevice().subscribe(newDeviceType => {
      Object.values(DeviceType).forEach(deviceTypeKey => {
        const deviceType = stringToEnum(DeviceType, deviceTypeKey) as DeviceType;
        if (newDeviceType === deviceTypeKey) {
          element.classList.add(deviceType);
        } else {
          element.classList.remove(deviceType);
        }
      })
    });
  }

  getDevice(): Observable<DeviceType> {
    return this.deviceSubject.asObservable().pipe(distinctUntilChanged());
  }

}

export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'md',
  Pc = 'gt-md'
}
