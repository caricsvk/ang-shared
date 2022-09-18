export class Load {

  private static loadedJs: string[] = [];
  private static depQueue: {[key: string]: string[]} = {};
  private static callback: {[key: string]: Function} = {};
  private static inProgress: string[] = [];

  public static loadJsOnce(src: string, callback?: () => any, dependencies: string[] = []) {
    //store callbacks
    callback = callback || function () {};
    const oldCallback = typeof Load.callback[src] === "function" ? Load.callback[src] : function () {};
    (function (oldCallback, callback) {
      Load.callback[src] = function () {
        oldCallback();
        callback();
      };
    } (oldCallback, callback));

    if (Load.inProgress.indexOf(src) >= 0)
      return;
    if (Load.loadedJs.indexOf(src) >= 0) { //script is loaded
        callback();
    } else if (this.hasLoadedDependencies(dependencies)) {

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = () => this.loadCallback(src);
      // @ts-ignore
      script.onreadystatechange = () => {
        //alert("onreadystatechange " + this.readyState + " : " + (this.readyState === "complete" || this.readyState === "loaded"));
        // @ts-ignore
        if (this.readyState === "complete" || this.readyState === "loaded")
          this.loadCallback(src);
      };
      script.onerror = function () {
        delete Load.inProgress[Load.inProgress.indexOf(src)];
        setTimeout(function () {
          // self.ccLoad(src);
        }, 2000);
      };
      Load.inProgress.push(src);
      delete Load.depQueue[src];
      document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      Load.depQueue[src] = dependencies;
    }
  }

  private static loadCallback(src: string) {
    //console.log("load callback " + src);
    Load.loadedJs.push(src);
    delete Load.inProgress[Load.inProgress.indexOf(src)];
    if (typeof Load.callback[src] === "function") {
      Load.callback[src]();
      delete Load.callback[src];
    }
    for (const scriptSrc in Load.depQueue) {
      this.loadJsOnce(scriptSrc, null, Load.depQueue[scriptSrc]);
    }
  }

  private static hasLoadedDependencies(dependencies: string[]) {
    const missingDependency = dependencies.find(dependency => Load.loadedJs.indexOf(dependency) === -1);
    return !missingDependency;
  }
}

