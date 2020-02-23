import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addressPath = globals.server+"/address";
  private headers;
  constructor(private http:HttpClient,
    private tokenService:TokenService) {}
  
    add(fullname:string, address:string, phone:number){
      this.headers = this.tokenService.getHeadersContainToken();
      let body = {fullName: fullname, address: address, phone:phone}
      return this.http.put(this.addressPath,body,{headers: this.headers,observe: 'response'});
    }
    get(){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.get(this.addressPath,{headers: this.headers,observe: 'response'});
    }
    delete(id: number){
      this.headers = this.tokenService.getHeadersContainToken();
      return this.http.delete(this.addressPath+"/"+id,{headers: this.headers,observe: 'response'});
    }
    selectNewSelectedAddress(id: number){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.patch(this.addressPath+"/"+id,"",{headers: this.headers,observe: 'response'});
    }
    getSelectedAddress(){
      this.headers = this.tokenService.getHeadersByAuthorization();
      return this.http.get(this.addressPath+"/selected",{headers: this.headers,observe: 'response'});
    }
}
