import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headerMessage = new BehaviorSubject('default');
  public headerMessageSubcriber = this.headerMessage.asObservable();
  constructor() { }
  changeMessage(message:string){
    this.headerMessage.next(message);
  }
}
