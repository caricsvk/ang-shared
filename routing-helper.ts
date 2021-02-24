import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export type MiloRoute = {
  path: any,
  queryParams?: any,
  data: MiloRouteData
};

export type MiloMenuType = 'main' | 'footer' | 'user';

export type MiloRouteData = {
  title: string,
  description?: string,
  keywords?: string,
  state?: string,
  inMenu?: MiloMenuType[],
  permission?: string,
};

export enum NavigationSpecialPermissions {
  HasVisibleChildren = 'HAS_VISIBLE_CHILDREN_PERMISSION'
}

/**
 * TODO document better how this works and what is it good for
 */
export abstract class MiloRouterLink<F extends () => void> {

  constructor(protected route: MiloRoute,
              protected parent?: MiloRouterLink<any>) { }

  abstract buildLink: F;

  get title(): string {
    return this.route && this.route.data ? this.route.data.title : '';
  }

  get path(): string {
    return this.route ? this.route.path : '';
  }

  get data(): MiloRouteData {
    return this.route ? this.route.data : {} as MiloRouteData;
  }

  /* TODO refactor this, split to getting by 'searchedUrl' and without it to make it clear if we search for parent's links
   or current link children */
  getMenuLinks(searchedUrl?: any[] | string, menuType: MiloMenuType = 'main', permissions?: Observable<string[]>):
    Observable<{link: any[], label: string}[]> {
    // @ts-ignore
    const searchedLinkParts = this.transformToParts(searchedUrl);
    const matchedLink = searchedLinkParts ? this.findMatch(searchedLinkParts) : this;
    if (!matchedLink) {
      return of([]);
    }
    const builtMatchedLink = matchedLink.buildLink();
    const linksForMenu = searchedUrl && matchedLink.parent ? matchedLink.parent : matchedLink;
    if (!permissions) {
      permissions = this.getPermissions();
    }
    // @ts-ignore
    return permissions.pipe(map(userPermissions =>
      linksForMenu.getLinks().map((link: MiloRouterLink<any>) => {
        const linkData = link.route.data;
        let hasPermission = !linkData.permission || userPermissions.includes(linkData.permission);
        const hasToHaveChildren = NavigationSpecialPermissions.HasVisibleChildren === linkData.permission;
        if (hasToHaveChildren) {
          link.getMenuLinks(undefined, menuType, of(userPermissions))
            .subscribe(links => hasPermission = links.length >= 1);
        }
        // @ts-ignore
        if (!linkData.inMenu.includes(menuType) || !hasPermission) {
          return undefined;
        }
        const matchedParams = this.extractParams(searchedLinkParts, builtMatchedLink);
        return {
          link: link.buildLink().map((part: any) => part === undefined ? matchedParams.shift() : part),
          queryParams: link.route.queryParams,
          label: link.route.data.title ? link.route.data.title : link.route.path
        };
      }).filter((menuLink: undefined | { queryParams: any; link: any; label: any }) => menuLink)
    ));
  }

  // @ts-ignore
  /**
   * searches in this and its children for matching url
   */
  findMatch(urlPath: string[] | string, recursive = true): any {
    const urlPathParts = this.transformToParts(urlPath);
    if (this.areSame(this, urlPathParts)) {
      return this;
    }
    const thisObjectLinks = this.getLinks();
    let foundLink = thisObjectLinks.find(link => this.areSame(link, urlPathParts));
    if (foundLink) {
      return foundLink;
    }
    for (let i = 0; recursive && i < thisObjectLinks.length; i ++) {
      const childLinks = thisObjectLinks[i].getLinks();
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < childLinks.length; j ++) {
        foundLink = childLinks[j].findMatch(urlPathParts);
        if (foundLink) {
          return foundLink;
        }
      }
    }
  }

  /**
   * compare if start of url path matches this link
   */
  startsLike(urlPath: string[] | string): boolean {
    const urlParts = this.transformToParts(urlPath);
    // @ts-ignore
    return !this.buildLink().find((part: string, index: number) => part !== undefined && urlParts[index] !== part);
  }

  isLike(urlPath: string[] | string): boolean {
    return this.areSame(this, this.transformToParts(urlPath));
  }


  protected getPermissions(): Observable<string[]> {
    return this.parent ? this.parent.getPermissions() : of([]);
  }

  protected getLinks(): MiloRouterLink<any>[] {
    const result: MiloRouterLink<any>[] = [];
    // beware that getOwnPropertyNames acts differently for lambda methods and standard methods
    const knownKeys = Object.getOwnPropertyNames(MiloRouterLink.prototype).concat(['parent', 'route']);
    for (const key in this) {
      if (knownKeys.includes(key)) {
        continue;
      }
      if (this[key] instanceof MiloRouterLink) {
        result.push(this[key] as any);
      }
    }
    return result;
  }

  private areSame(link: MiloRouterLink<any>, searchedLink: any[]): boolean {
    const builtLink = link.buildLink();
    return builtLink.length === searchedLink.length && link.startsLike(searchedLink);
  }

  private transformToParts(urlPathParts: string[] | string): string[] {
    if (typeof urlPathParts === 'string') {
      urlPathParts = urlPathParts.split('?')[0].split('/');
      urlPathParts[0] = urlPathParts[0] ? urlPathParts[0] : '/';
    }
    if (urlPathParts) { // matrix params fix
      const splitByMatrix = (part: string) => part.includes(';') ? part.split(/;(.+)/).slice(0, -1) : [part];
      urlPathParts = urlPathParts.map(splitByMatrix).reduce((result, val) => (result || []).concat(val));
    }
    return urlPathParts as string[];
  }

  private extractParams(searchedLinkParts: string[], matchedLink: string[]): any {
    return !searchedLinkParts ? [] : searchedLinkParts.filter(
      (part: string, index: number) => matchedLink[index] === undefined).map(param => {
      const result: {[key: string]: string} | string = param.includes('=') ? {} : param;
      param.split(';').forEach(keyValueStr => {
        const keyValue = keyValueStr.split('=');
        // @ts-ignore
        result[keyValue[0]] = keyValue[1];
      });
      return result;
    });
  }
}

export class BasicLink extends MiloRouterLink<() => any[]> {
  public buildLink = () => {
    const pathArray = this.route.path === null ? [] : [this.route.path]; // ignore null, keep undefined
    return this.parent ? this.parent.buildLink().concat(pathArray) : pathArray;
  }
}

// @ts-ignore
export class BasicLinkWithParam extends MiloRouterLink<(param: string) => any[]> {
  public buildLink = (param: string) => {
    const pathArray = this.route.path.split('/').map((pathPart: string) => pathPart.startsWith(':') ? param : pathPart);
    return this.parent ? this.parent.buildLink().concat(pathArray) : pathArray;
  }
}
