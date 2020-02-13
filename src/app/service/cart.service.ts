import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService } from './token.service';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private dataSerivce: DataService) { }
    private server = globals.serverPermit;
    private cartPath = globals.server+"/cart";
    private headers;

    add(id:number){
      if(this.dataSerivce.getTokenCookie() !== null){
        this.headers = this.tokenService.getHeadersContainToken();
      }else{
        this.headers = this.tokenService.getHeader();
      }
      return this.http.get(this.cartPath+"/add/"+id,{headers: this.headers,observe: 'response'});
    }
    remove(id:number){
      if(this.dataSerivce.getTokenCookie() !== null){
        this.headers = this.tokenService.getHeadersContainToken();
      }else{
        this.headers = this.tokenService.getHeader();
      }
      return this.http.get(this.cartPath+"/remove/"+id,{headers: this.headers,observe: 'response'});
    }
    getCarts(){
      if(this.dataSerivce.getTokenCookie() !== null){
        this.headers = this.tokenService.getHeadersContainToken();
      }else{
        this.headers = this.tokenService.getHeader();
      }
      return this.http.get(this.cartPath,{headers: this.headers,observe: 'response'});
    }
    removeAllQuantity(id:number){
      if(this.dataSerivce.getTokenCookie() !== null){
        this.headers = this.tokenService.getHeadersContainToken();
      }else{
        this.headers = this.tokenService.getHeader();
      }
      return this.http.get(this.cartPath+"/remove-all/"+id,{headers: this.headers,observe: 'response'})
    }
}
