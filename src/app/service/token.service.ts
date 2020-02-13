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
      'Authorization': this.getAuthorization(),
      'Accept':'application/json'
    });
  }
  getAuthorization(){
    if(this.dataService.getTokenCookie())
    return 'Bearer '+this.dataService.getTokenCookie();
    else
    return "";
  }
  getHeader(){
    return new HttpHeaders({
      'Content-type' : 'application/json',
      'Accept':'application/json'
    });
  }
}
