import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  getHeader(){
    return new HttpHeaders({
      'Content-type' : 'application/json',
      'Accept':'application/json'
    });
  }
}
