export class Load {

  private static loadedJs: string[] = [];
  private static dependentFiles: DependentFile[] = [];
  private static inProgressFiles: {[key: string]: DependentFile[]} = {};

  public static loadOne(
    fileOrSrc: DependentFile | string, dependencies?: string[], callback?: Function
  ): Promise<void> {
    const file = fileOrSrc instanceof DependentFile ? fileOrSrc : new DependentFile(fileOrSrc);
    if (dependencies) {
      file.dependencies = dependencies.map(dep => new DependentFile(dep))
    }
    if (typeof callback === 'function') {
      file.setCallback(callback);
    }
    return this.loadFile(file);
  }

  public static loadMulti(files: (DependentFile | string)[], dependencies?: string[]): Promise<void>[] {
    return files.map((file: DependentFile | string) => this.loadOne(file, dependencies));
  }

  private static loadFile(file: DependentFile): Promise<void> {
    const alreadyInDepQueue = this.dependentFiles.includes(file);
    const inProgressFile = this.inProgressFiles[file.src];
    if (this.loadedJs.indexOf(file.src) >= 0) {
      file.resolve();
    } else if (inProgressFile && inProgressFile.indexOf(file) === -1) {
      inProgressFile.push(file);
    } else if (!inProgressFile && !this.hasLoadedDependencies(file) && !alreadyInDepQueue) {
      this.dependentFiles.push(file);
      file.dependencies.forEach(dependencyFile => Load.loadFile(dependencyFile));
    } else if (!inProgressFile && this.hasLoadedDependencies(file)) {
      this.load(file);
    }
    return file.promise;
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
    const indexAsDependentFile = Load.dependentFiles.indexOf(file);
    if (indexAsDependentFile >= 0) {
      Load.dependentFiles.splice(indexAsDependentFile, 1);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  private static onFileLoad(src: string) {
    Load.loadedJs.push(src);
    const files = Load.inProgressFiles[src];
    delete Load.inProgressFiles[src];
    files.forEach(file => file.resolve());
    Load.dependentFiles.forEach(file => Load.loadFile(file));
  }

  private static hasLoadedDependencies(file: DependentFile) {
    const missingDependency = file.dependencies.find(dependency => Load.loadedJs.indexOf(dependency.src) === -1);
    return !missingDependency;
  }
}

class DependentFile {
  private promiseResolve: Function;
  promise: Promise<void>;
  constructor(
    public src: string,
    public dependencies: DependentFile[] = [],
    private callback: Function = function () {}
  ) {
    this.promise = new Promise(resolve => this.promiseResolve = resolve);
  }

  setCallback(callback: Function) {
    this.callback = callback
  }

  resolve() {
    if (typeof this.callback === "function") {
      this.callback();
    }
    this.promiseResolve();
  }
}
