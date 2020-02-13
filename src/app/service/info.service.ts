import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient,
    private tokenService: TokenService) { }
    private server = globals.serverPermit;
    private userPath = globals.server+"/user";
    private headers = this.tokenService.getHeadersContainToken();

    updateInfo(fullName:string, email:string, password:string){
      let body = {email:email, fullName:fullName, password:password}
      return this.http.post(this.userPath+"/update",body,{headers: this.headers,observe: 'response'});
    }
}
