export class TableColumn {

  constructor(
    public name: string,
    public key: string,
    public type: ColumnType = ColumnType.String,
    public view?: (arg: any) => string,
    public values?: any[]
  ) {
  }

  get hasMinMax() {
    return [ColumnType.Datetime, ColumnType.Number].includes(this.type);
  }
}

export enum ColumnType {
  String,
  Number,
  Boolean,
  Datetime,
  Select,
}
