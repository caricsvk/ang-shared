import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KeydownService {

  constructor() {
  }

  delete = new Subject<void>();
}
