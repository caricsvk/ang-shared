import { TableState } from './table-state';
import { TableColumn } from './table-column';
import { TableAdapter } from './table-adapter';
import { TableAction } from './table-action';
import { Observable, ReplaySubject } from 'rxjs';

export abstract class TableAdapterBasic implements TableAdapter {

  private lastFetchedState: string;
  private replaySubject = new ReplaySubject<TableState>();

  protected constructor(state: TableState = new TableState()) {
    this.setState(state);
  }

  private getStateString(state: TableState): string {
    // prevent fetching duplicated state d
    const numberToString = (key: string, value: string | number) => typeof value === 'number' ? value + '' : value;
    return JSON.stringify(state, numberToString);
  }

  setState(state: TableState): void {
    const newStateString = this.getStateString(state);
    if (this.replaySubject && this.lastFetchedState !== newStateString) {
      this.lastFetchedState = newStateString;
      this.replaySubject.next(state);
    }
  }

  onStateChange(): Observable<TableState> {
    return this.replaySubject.asObservable();
  }

  getActions(): TableAction[] {
    return [];
  }

  abstract fetchData(tableState: TableState): Observable<any[]>;

  abstract fetchCount(tableState: TableState): Observable<number>;

  abstract getAllColumns(): TableColumn[];

}
