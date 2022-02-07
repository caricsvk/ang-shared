import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class LocalService<T> {

  protected allEntitiesSubject = new BehaviorSubject<T[]>([]);

  protected abstract getStorageKey(): string;
  abstract createT(): T;

  constructor(
  ) {
    this.allEntitiesSubject.next(this.fetchAll());
  }



  findEntityIndex(key: string | number, entities: T[]) {
    // @ts-ignore
    return entities.findIndex(entity => entity && (entity[this.getIdName()] && entity[this.getIdName()] == key));
  }

  fetchAll() {
    const jsonString = window.localStorage.getItem(this.getStorageKey());
    const json = !jsonString || jsonString === 'null' || jsonString === 'undefined' ? [] : JSON.parse(jsonString);
    return json.map((jsonObj: any) => this.mapToEntity(jsonObj));
  }

  save(entity: T) {
    entity = Object.assign(this.createT(), entity);
    // @ts-ignore
    const existingIndex = this.findEntityIndex(entity[this.getIdName()], this.allEntitiesSubject.value);
    if (existingIndex >= 0) {
      this.allEntitiesSubject.value.splice(existingIndex, 1, entity);
    } else {
      this.allEntitiesSubject.value.push(entity);
    }
    window.localStorage.setItem(this.getStorageKey(), JSON.stringify(this.allEntitiesSubject.value));
    this.allEntitiesSubject.next(this.allEntitiesSubject.value);
    return entity;
  }

  remove(id: any) {
    const existingIndex = this.findEntityIndex(id, this.allEntitiesSubject.value);
    if (existingIndex >= 0) {
      this.allEntitiesSubject.value.splice(existingIndex, 1);
      window.localStorage.setItem(this.getStorageKey(), JSON.stringify(this.allEntitiesSubject.value));
      this.allEntitiesSubject.next(this.allEntitiesSubject.value);
      return id;
    }
    throw `entity ${id} not found`;
  }

  find(id: number | string): T | null {
    let foundIndex = this.findEntityIndex(id, this.allEntitiesSubject.value);
    return foundIndex >= 0 ? this.allEntitiesSubject.value[foundIndex] : null;
  }

  getAll() {
    return this.allEntitiesSubject.asObservable();
  }

  search(params: HttpParams = new HttpParams()) {
    params = params || new HttpParams();
    const filteredUsers = this.filter(params);
    // console.log('local search', params, filteredUsers);
    const order: string = params.get('order') || this.getDefaultOrdering();
    const orderDirection = params.get('orderType') === 'ASC' ? -1 : 1;
    const orderFn = (a: any, b: any) => b[order] < a[order] ? -1 * orderDirection : b[order] > a[order] ? 1 * orderDirection : 0;
    const limitString = params.get('limit');
    let limit = parseInt(limitString ? limitString : '5', 10);
    const offsetString = params.get('offset');
    let offset = parseInt(offsetString ? offsetString : '0', 10);
    // @ts-ignore
    return filteredUsers.sort(orderFn).slice(offset, offset + limit + 1);
  }

  countSearch(params: HttpParams = new HttpParams()) {
    return this.filter(params).length;
  }

  protected filter(params: HttpParams) {
    let users = this.allEntitiesSubject.value;
    for (let filterKey of params.keys()) {
      // TODO
      if (filterKey.endsWith('_wild')) {
        const column = filterKey.split('_wild')[0];
        // @ts-ignore
        users = users.filter(user => user[column] && user[column].includes(params.get(filterKey)));
      }
    }
    return users;
  }

  protected getIdName(): string {
    return 'id';
  }

  protected getDefaultOrdering(): string {
    return 'id';
  }

  protected mapToEntity(object: any): T {
    return Object.assign(this.createT(), object);
  }

}
