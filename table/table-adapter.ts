import { TableState } from './table-state';
import { TableColumn } from './table-column';
import { TableAction } from './table-action';
import { Observable } from 'rxjs';

export interface TableAdapter {

  fetchData(tableState: TableState): Observable<any[]>;

  fetchCount(tableState: TableState): Observable<number>;

  getAllColumns(): TableColumn[];

  getActions(): TableAction[];

  setState(state: TableState): void;

  onStateChange(): Observable<TableState>;

}
