import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {introLine2} from '../environtments';
import { CookieService } from 'ngx-cookie-service'
import { Cart } from '../class/cart';
import { Intro } from '../interface/intro';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private carts: Cart[]
  private headerMessage = new BehaviorSubject('default');
  public headerMessageSubcriber = this.headerMessage.asObservable();
  constructor(
    private cookieService:CookieService
  ) { }
  changeMessage(message:string){
    this.headerMessage.next(message);
  }
  setCarts(carts:Cart[]){
    this.carts = carts;
  }
  getCarts():Cart[]{
    return this.carts;
  }
  setFullNameCookie(name:string){
    this.cookieService.set("fullName",name,10,"/");
  }
  getFullNameCookie():string{
    return this.cookieService.get("fullName");
  }
  setEmailCookie(user:string){
    this.cookieService.set("email",user,10,"/");
  }
  getEmailCookie():string{
    return this.cookieService.get("email");
  }
  checkCookieObject(nameObject:string):boolean{
    return this.cookieService.check(nameObject);
  }
  setCookieObject(nameObject:string, object:string, expire:number){
    this.cookieService.set(nameObject,object,expire);
  }
  deleteCookieObject(nameObject: string){
    this.cookieService.delete(nameObject);
  }
  deleteAllCookies(){
    // sometimes deleteAll not working properly
    this.cookieService.deleteAll("/");
  }
  setTokenCookie(token:string){
    this.cookieService.set("token",token,10,"/");
  }
  getTokenCookie(){
    return this.cookieService.get("token");
  }
  setAuthorizationInfo(body:any, message:string){
    //set user for data service and send message to header component
    this.setEmailCookie(body.user.email);
    this.setFullNameCookie(body.user.fullName);
    this.setTokenCookie(body.token);
    this.changeMessage(message);
    // when login and signup success
  }
  getSubcategoryByGender(gender:string, subCategoryName:string){
    let subCategories:Map<string,Intro> = introLine2.get(gender);
    if(subCategories !== undefined){
      let res = subCategories.get(subCategoryName.toLowerCase());
      return res;
    }
  }
}
