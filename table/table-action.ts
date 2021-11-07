export class TableAction {

  icon: string;

  constructor(
    public name: string,
    public trigger: (arg: any) => void,
    private showed?: (arg: any) => boolean
  ) {
    if (name.startsWith('icon:')) {
      this.icon = name.substr(5);
      this.name = '';
    }
  }

  public show(row: any): boolean {
    return typeof this.showed === 'function' && row ? this.showed(row) : true;
  }

}
