import { ColumnType, TableColumn } from './table-column';
import { HttpParams } from '@angular/common/http';
import { FilterChange, FilterType } from '../filter/filter.component';

export class TableState {

  private static readonly FILTER_TYPES_KEYS = Object.keys(FilterType);

  constructor(
    public page: number = 1,
    public pageSize: number = 5,
    public order?: string,
    public orderType: 'ASC' | 'DESC' = 'DESC'
  ) {
  }

  public static create(params: any): TableState {
    const result = new TableState();
    // tslint:disable-next-line:forin
    for (const key in params) {
      result.setValue(key, params[key]);
    }
    return result;
  }

  applyFilter(key: string, change: FilterChange): TableState {
    // console.log('applyFilterChange', key, change);
    let otherPairKey = change.type === FilterType.MIN ? key + FilterType.MAX :
        change.type === FilterType.MAX ? key + FilterType.MIN : null;
    // @ts-ignore
    let otherPairValue = otherPairKey ? this[otherPairKey] : null;
    this.clearFilter(key);
    // @ts-ignore
    this[key + change.type] = change.value;
    if (otherPairValue) {
      // console.log('setting other pair', otherPairKey, otherPairValue);
      // @ts-ignore
      this[otherPairKey] = otherPairValue;
    }
    return this;
  }

  public setOrder(column: TableColumn): void {
    this.orderType = this.order !== column.key ? 'DESC' : this.getOppositeOrderType();
    this.order = column.key;
  }

  public toParams(): HttpParams {
    let params = new HttpParams();
    // tslint:disable-next-line:forin
    for (const key in this) {
      if (this.hasOwnProperty(key) && this.isSet(this[key]) && key !== 'page' && key !== 'pageSize') {
        params = params.set(key, '' + this[key]);
      }
    }
    const limit: number = this.pageSize ? this.pageSize : 10;
    const page: number = this.page ? this.page : 1;
    params = params.set('limit', '' + limit);
    params = params.set('offset', '' + (limit * (page - 1)));
    return params;
  }

  public containsKeyPrefix(searchedPrefix: string): boolean {
    for (const key in this) {
      if (this.hasOwnProperty(key) && this.isSet(this[key]) && key.startsWith(searchedPrefix)) {
        return true;
      }
    }
    return false;
  }

  clearFilter(columnKey: string): void {
    // @ts-ignore
    Object.values(FilterType).map(key => columnKey + key).filter(key => this.hasOwnProperty(key)).forEach(key => delete this[key]);
  }

  deserializeColumnValue(column: TableColumn): any {
    // @ts-ignore
    const emptyValue = this[column.key + FilterType.EMPTY];
    if (column.type === ColumnType.Boolean) {
      // console.log('deserializeeee', emptyValue, column.key + FilterType.EMPTY, this);
    }
    if (this.isSet(emptyValue)) {
      return this.convertBooleanValue(emptyValue);
    }
    switch (column.type) {
      case ColumnType.Number:
      case ColumnType.Datetime:
        // @ts-ignore
        let min = this[column.key + FilterType.MIN];
        if (min && column.type === ColumnType.Datetime) {
          min = new Date(parseInt(min));
        }
        // @ts-ignore
        let max = this[column.key + FilterType.MAX];
        if (max && column.type === ColumnType.Datetime) {
          max = new Date(parseInt(max));
        }
        return { min, max };
      case ColumnType.Boolean:
        // @ts-ignore
        return this[column.key + FilterType.EXACT];
      case ColumnType.Select:
        break;
      case ColumnType.String:
      default:
        // @ts-ignore
        return this[column.key + FilterType.WILDCARD];
    }
  }

  private getOppositeOrderType(): 'DESC' | 'ASC' {
    return this.orderType === 'ASC' ? 'DESC' : 'ASC';
  }

  private isSet(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  private convertBooleanValue(value: any): boolean {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }

  private setValue(key: string, value: any) {
    if (key == 'page' || key == 'pageSize') {
      value = parseInt(value);
    }
    // @ts-ignore
    const filterTypeKey = TableState.FILTER_TYPES_KEYS.find(suffix => key.endsWith(suffix));
    if (filterTypeKey) {
      // @ts-ignore
      this.applyFilter(key.slice(0, key.length - filterTypeKey.length), {type: filterTypeKey, value});
    } else if (typeof value != 'function') {
      // @ts-ignore
      this[key] = value;
    }
  }

}
