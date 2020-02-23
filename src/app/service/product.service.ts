import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private server:string = globals.serverPermit;
  private headers = this.tokenService.getHeader();
  constructor(private http: HttpClient,
    private tokenService:TokenService) { }

    getByProductOptionLink(link:string){
      return this.http.get(this.server+"/product/"+link,{headers: this.headers,observe: 'response'});
    }
}
