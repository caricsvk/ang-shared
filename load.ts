export class Load {

  private static loadedJs: string[] = [];
  private static dependentFiles: DependentFile[] = [];
  private static inProgressFiles: {[key: string]: DependentFile[]} = {};

  public static loadJsOnce(file: DependentFile | string, callback: Function = () => {}) {
    if (typeof file === 'string') {
      file = new DependentFile(file);
    }
    const alreadyInDepQueue = this.dependentFiles.includes(file);
    const inProgressFile = this.inProgressFiles[file.src];

    if (this.loadedJs.indexOf(file.src) >= 0) {
      file.callback();
    } else if (inProgressFile && inProgressFile.indexOf(file) === -1) {
      inProgressFile.push(file);
    } else if (!inProgressFile && !this.hasLoadedDependencies(file) && !alreadyInDepQueue) {
      this.dependentFiles.push(file);
      file.dependencies.forEach(dependencyFile => Load.loadJsOnce(dependencyFile));
    } else if (!inProgressFile && this.hasLoadedDependencies(file)) {
      this.load(file);
    }
  }

  private static load(file: DependentFile) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = file.src;
    script.onload = () => this.onFileLoad(file.src);
    // @ts-ignore
    script.onreadystatechange = () => {
      //alert("onreadystatechange " + this.readyState + " : " + (this.readyState === "complete" || this.readyState === "loaded"));
      // @ts-ignore
      if (this.readyState === "complete" || this.readyState === "loaded")
        this.onFileLoad(file.src);
    };
    script.onerror = function () {
      delete Load.inProgressFiles[file.src];
      setTimeout(function () {
        // self.ccLoad(src);
      }, 2000);
    };
    if (!Load.inProgressFiles[file.src]) {
      Load.inProgressFiles[file.src] = [];
    }
    Load.inProgressFiles[file.src].push(file);
    Load.dependentFiles.splice(Load.dependentFiles.indexOf(file), 1);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  private static onFileLoad(src: string) {
    //console.log("load callback " + src);
    Load.loadedJs.push(src);
    const files = Load.inProgressFiles[src];
    delete Load.inProgressFiles[src];
    files.filter(file => typeof file.callback === "function").forEach(
      file => file.callback()
    );
    Load.dependentFiles.forEach(file => Load.loadJsOnce(file));
  }

  private static hasLoadedDependencies(file: DependentFile) {
    const missingDependency = file.dependencies.find(dependency => Load.loadedJs.indexOf(dependency.src) === -1);
    return !missingDependency;
  }
}

class DependentFile {
  constructor(
    public src: string,
    public callback: Function = function () {},
    public dependencies: DependentFile[] = []
  ) {
  }
}
