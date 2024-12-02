import { NavigationExtras, Router } from '@angular/router';

export abstract class AppRoute {

  constructor(
    private router: Router,
    private outlet: string | null,
    private navigationParts: any[],
    private extras: NavigationExtras = {},
    private forceOutletsClearing = false
  ) {
  }

  abstract getAllOutlets(): string[];

  clearThisRouteOutlet(extras?: NavigationExtras): Promise<boolean> {
    extras = extras || this.extras;
    extras.replaceUrl = true;
    if (! this.outlet) {
      throw Error('this route is main route, cannot be cleared');
    }
    const outlets = this.getOutlets(false);
    outlets[this.outlet] = null;
    return this.router.navigate([{outlets}], extras);
  }

  async navigate(clearOtherOutlets = false): Promise<boolean> {
    const outlets = this.getOutlets(clearOtherOutlets);
    if (this.outlet) {
      const url = this.router.url;
      if (url.includes(this.outlet + ':') && outlets[this.outlet]) {
        const existingOutletNewValue = outlets[this.outlet];
        outlets[this.outlet] = null;
        this.extras.replaceUrl = true;
        await this.router.navigate([{outlets}], this.extras);
        outlets[this.outlet] = existingOutletNewValue;
      }
    }
    // console.log('navigating...', [{outlets}], this.extras);
    const commands = !clearOtherOutlets && this.navigationParts && this.navigationParts.length === 0 ? [] : [{outlets}];
    return this.router.navigate(commands, this.extras);
  }

  getOutlets(clearOtherOutlets: boolean): {[key: string]: Array<string | number> | null} {
    const outlets: {[key: string]: Array<string | number> | null} = {};
    if (clearOtherOutlets || this.forceOutletsClearing) {
      // if (! outlets['primary']) {
      //   outlets['primary'] = null;
      // }
      this.getAllOutlets().forEach(key => {
        if (typeof key === 'string') {
          outlets[key] = null;
        }
      });
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
