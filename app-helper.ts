export class AppHelper {

  static isLiveProductionEnvironment(): boolean {
    const currentHost: string = window.location.hostname || window.location.host;
    return currentHost.indexOf('dboard') >= 0; // TODO xxx https://dboard.app
  }

}

export class StateHelper {

  private static lastKey: string;
  private static lastState: number | null | undefined;
  private static lastComputedState: string | undefined;

  static getState(key: string, value: number | null, classes = ['left', 'right']): string | undefined {
    if (this.lastKey !== key) {
      this.lastState = undefined;
      this.lastComputedState = undefined;
    }
    this.lastKey = key;
    if (this.lastState !== value) {
      if (this.lastState !== undefined) {
        // @ts-ignore
        const newComputedState = this.lastState > value ? classes[0] : classes[1];
        this.lastComputedState = newComputedState + 'A' === this.lastComputedState ?
          newComputedState + 'B' : newComputedState + 'A';
      }
      this.lastState = value;
      // console.log('changing state', this.lastStates[key], 'returning', this.lastComputedStates[key]);
    }
    return this.lastComputedState;
  }

  static round(value: number): number {
    if (typeof value !== 'number') {
      return 0;
    }
    return parseFloat((value).toFixed(4));
  }

}

export class FullScreenHelper {

  static toggleFullScreen(): void {
    if (this.isFullScreen()) {
      this.closeFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  static openFullscreen(): void {
    const elem = document.documentElement as any;
    // console.log('openFullscreen', elem);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  static closeFullscreen(): void {
    const xDocument = document as any;
    if (xDocument.exitFullscreen) {
      xDocument.exitFullscreen();
    } else if (xDocument.mozCancelFullScreen) { /* Firefox */
      xDocument.mozCancelFullScreen();
    } else if (xDocument.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      xDocument.webkitExitFullscreen();
    } else if (xDocument.msExitFullscreen) { /* IE/Edge */
      xDocument.msExitFullscreen();
    }
  }

  static isFullScreen(): boolean {
    const xDocument = document as any;
    return xDocument.fullscreenElement || /* Standard syntax */
      xDocument.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
      xDocument.mozFullScreenElement ||/* Firefox syntax */
      xDocument.msFullscreenElement; /* IE/Edge syntax */
  }

}
