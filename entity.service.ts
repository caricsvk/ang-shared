import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T> {

  constructor(
    protected httpClient: HttpClient
  ) { }

  protected abstract getApiPath(): string;
  protected abstract createT(obj?: object): T;

  fetchCountSearch(params: HttpParams): Promise<number> {
    // @ts-ignore
    return this.httpClient.get<{value: number}>(this.getApiPath() + '/count', {params})
      .pipe(map((json: any): number => json.value)).toPromise();
  }

  fetchSearch(params?: HttpParams): Promise<T[]> {
    // @ts-ignore
    return this.httpClient.get<any[]>(this.getApiPath(), {params})
      .pipe(map((items: any[]): T[] => items.map(obj => this.createT(obj)))).toPromise();
  }

  save(user: T): Observable<T> {
    // @ts-ignore
    return this.httpClient[user.id ? 'put' : 'post']<any>(this.getApiPath(), user).pipe(map(obj => this.createT(obj)));
  }

  remove(id: number) {
    return this.httpClient.delete<any>(this.getApiPath() + `/${id}`);
  }

  find(id: string) {
    return this.httpClient.get<any>(this.getApiPath() + `/${id}`).pipe(map(obj => this.createT(obj)),).toPromise();
  }

}
