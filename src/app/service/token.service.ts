import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private dataService:DataService) { }
  getHeadersContainToken(){
    return new HttpHeaders({
      'Content-type' : 'application/json',
      'Authorization': 'Bearer '+this.dataService.getTokenCookie(),
      'Accept':'application/json'
    });
  }
  getHeader(){
    return new HttpHeaders({
      'Content-type' : 'application/json',
      'Accept':'application/json',
      'Authorization': ''
    });
  }
  getHeadersByAuthorization(){
    if(this.dataService.checkCookieObject("token")){
      return this.getHeadersContainToken();
    }
    else{
      return this.getHeader();
    }
  }
}
