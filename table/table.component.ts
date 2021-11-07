import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TableState } from './table-state';
import { ColumnType, TableColumn } from './table-column';
import { TableAction } from './table-action';
import { TableAdapter } from './table-adapter';
import { Subject, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FilterChange } from '../filter/filter.component';

@Component({
  selector: 'milo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  private dataSubscription: Subscription;
  private countSubscription: Subscription;

  // mandatory
  @Input() adapter: TableAdapter;

  // optional
  @Input() showFilters: boolean | null = null;
  @Input() makeEmptyRows = true;

  actions: TableAction[] | null = null;

  state: TableState = new TableState(1, 10);
  columns: TableColumn[] = [];
  maxPages = 1;
  rowsTotalCount = 0;

  dataSource$ = new Subject<any[]>();
  displayedColumns: string[] = [];

  constructor(
      private datePipe: DatePipe,
      private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('MiloTableComponent ngOnChanges');
    this.columns = this.adapter.getAllColumns();
    this.displayedColumns = this.columns.map(column => column.key);
    this.displayedColumns.push('last');
    this.actions = this.adapter.getActions();
    this.adapter.onStateChange().subscribe(state => this.fetch(state));
  }

  ngOnDestroy(): void {
    this.countSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  fetch(newState: TableState): void {
    // console.log('MiloTableComponent fetching', newState);
    if (newState) {
      this.state = newState;
    }
    if (!this.state.order) {
      this.state.setOrder(this.columns[0]);
    }
    this.fetchCount(this.state);
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.dataSubscription = this.adapter.fetchData(this.state).subscribe((data: any[]) => {
      for (let i = data.length; this.makeEmptyRows && i < this.state.pageSize; i++) {
        data.push(null);
      }
      this.dataSource$.next(data);
    });

    // set showFilters if there is some value in filters
    for (let i = 0; this.showFilters === null && i < this.columns.length; i++) {
      if (this.state.containsKeyPrefix(this.columns[i].key)) {
        this.showFilters = true;
      }
    }
  }

  private fetchCount(stateArg?: TableState): void {
    const state = stateArg || this.state;
    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
    }
    this.countSubscription = this.adapter.fetchCount(state).subscribe(count => {
      this.rowsTotalCount = count;
      this.maxPages = parseInt('' + ((state.pageSize + count) / state.pageSize), 10);
    });
  }

  public filterResults(): void {
    // console.log('filter', this.stateForCount);
    this.state.page = 1;
    this.adapter.setState(this.state);
  }

  public changeFilter(column: TableColumn, change: FilterChange): void {
    this.state.applyFilter(column.key, change);
    this.fetchCount(this.state);
  }

  public changeSort(column: TableColumn): void {
    this.state.setOrder(column);
    this.adapter.setState(this.state);
  }

  public view(column: TableColumn, row: any): string | null {
    if (!row) {
      return '';
    }
    const value = row[column.key];
    switch (column.type) {
      case ColumnType.Number:
        return this.decimalPipe.transform(value);
      case ColumnType.Datetime:
        return this.datePipe.transform(value, 'medium');
      case ColumnType.Select:
        return '';
      case ColumnType.Boolean:
      case ColumnType.String:
      default:
        return value;
    }
  }

  public processPageEvent(pageEvent: PageEvent): void {
    this.changePageSize(pageEvent.pageSize);
    this.changePage(pageEvent.pageIndex);
  }

  private changePageSize(pageSize: number): void {
    if (pageSize !== this.state.pageSize) {
      this.state.page = 1;
      this.state.pageSize = pageSize;
      this.adapter.setState(this.state);
    }
  }

  private changePage(pageIndex: number): void {
    const newPage = pageIndex + 1;
    if (newPage >= 1 && newPage <= this.maxPages) {
      this.state.page = newPage;
      this.adapter.setState(this.state);
    }
  }
}
