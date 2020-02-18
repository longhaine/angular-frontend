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
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.put(this.cartPath+"/"+id,"",{headers: this.headers,observe: 'response'});
    }
    minusCart(id:number){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.delete(this.cartPath+"/minus-quantity/"+id,{headers: this.headers,observe: 'response'});
    }
    getCarts(){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.get(this.cartPath,{headers: this.headers,observe: 'response'});
    }
    deleteAllQuantityCart(id:number){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.delete(this.cartPath+"/"+id,{headers: this.headers,observe: 'response'})
    }
    merge(){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.put(this.cartPath+"/merge","",{headers: this.headers,observe: 'response'});
    }
}
