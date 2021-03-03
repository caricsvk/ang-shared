import { NavigationExtras, Router } from '@angular/router';

export abstract class AppRoute {

  constructor(
    private router: Router,
    private outlet: string,
    private navigationParts: Array<string | number>,
    private extras: NavigationExtras = {}
  ) {
  }

  abstract getAllOutlets(): string[];

  clearThisRouteOutlet(): Promise<boolean> {
    if (! this.outlet) {
      throw Error('this route is main route, cannot be cleared');
    }
    const outlets = this.getOutlets(false);
    outlets[this.outlet] = null;
    return this.router.navigate([{outlets}], {replaceUrl: true});
  }

  async navigate(clearOtherOutlets = false): Promise<boolean> {
    const outlets = this.getOutlets(clearOtherOutlets);
    if (this.outlet) {
      const url = this.router.url;
      if (url.includes(this.outlet + ':') && outlets[this.outlet]) {
        const existingOutletNewValue = outlets[this.outlet];
        outlets[this.outlet] = null;
        await this.router.navigate([{outlets}], {replaceUrl: true});
        outlets[this.outlet] = existingOutletNewValue;
      }
    }
    // console.log('navigating...', [{outlets}], this.extras);
    return this.router.navigate([{outlets}], this.extras);
  }

  getOutlets(clearOtherOutlets: boolean): {[key: string]: Array<string | number>} {
    const outlets: {[key: string]: Array<string | number>} = {};
    if (clearOtherOutlets) {
      // if (! outlets['primary']) {
      //   outlets['primary'] = null;
      // }
      this.getAllOutlets().forEach(key => outlets[key] = null);
    }
    outlets[this.outlet ? this.outlet : 'primary'] = this.navigationParts;
    return outlets;
  }

  getLink(clearOtherOutlets = false): any {
    return ['', {outlets: this.getOutlets(clearOtherOutlets)}];
  }

  getNavigationParts(): Array<string | number> {
    return this.navigationParts;
  }

  getExtras(): NavigationExtras {
    return this.extras;
  }

}
