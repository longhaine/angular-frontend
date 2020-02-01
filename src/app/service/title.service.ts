import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor() { }

  capitalizeFirstLetter(value:string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  replaceLineBreaksToSpace(value:string){
    return value.replace(/\-/g,' ');
  }
  shopComponentTitleHandler(gender:string, subCategoryName:string):string{
    return this.capitalizeFirstLetter(gender)+"'s "+this.replaceLineBreaksToSpace(subCategoryName)+" | Everlane";
  }
}
