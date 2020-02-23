import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderPath: string = globals.server+"/order";
  private headers;
  constructor(private http: HttpClient,
    private tokenService: TokenService) { }
    
    placeOrder(body:any){
      this.headers = this.tokenService.getHeadersContainToken();
      return this.http.put(this.orderPath,body,{headers: this.headers,observe: 'response'});
    }

    getOrders(){
      this.headers = this.tokenService.getHeadersContainToken();
      return this.http.get(this.orderPath,{headers: this.headers,observe: 'response'});
    }
}
