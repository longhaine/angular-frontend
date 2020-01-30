import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {introLine} from '../environtments';
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
  triggerHeaderComponent(component:string){
    this.headerMessageSubcriber.subscribe(message =>{
      if(message === "ready"){
        this.changeMessage(component);
      }
    });
  }
  getSubcategoryByGender(gender:string, subCategoryName:string){
    for(const [genderKey, genderValue] of Object.entries(introLine)){
        if(genderKey === gender.toLowerCase()){
          for(const [subcateKey,subcateValue] of Object.entries(genderValue)){
            if(subcateKey === subCategoryName.toLowerCase()){
              return subcateValue; 
            }
        }
      }
    }
  }
}
