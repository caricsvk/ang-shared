import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ColumnType, TableColumn } from '../table/table-column';

@Component({
  selector: 'milo-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnChanges {

  ColumnType = ColumnType;
  FilterType = FilterType;

  @Output() public valueChanged = new EventEmitter<FilterChange>();

  @Input() public column: TableColumn;
  @Input() public value: any;

  emptyFilter: boolean | null;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes['value'].currentValue === 'boolean') {
      this.emptyFilter = changes['value'].currentValue;
      this.value = this.column.hasMinMax ? {} : undefined;
      return;
    }
    this.emptyFilter = null;
  }

  emitChange(change: FilterChange): void {
    this.valueChanged.emit(change);
  }

}

export interface FilterChange {
  type?: FilterType,
  value: any
}

export enum FilterType {
  WILDCARD = '_wild',
  MIN_MAX = '_minmax',
  MIN = '_min',
  MAX = '_max',
  EMPTY = '_empty',
  EXACT = '_exact',
  EXACT_NOT = '_exact_not'
}
