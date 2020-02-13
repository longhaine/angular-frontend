import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
    private tokenService: TokenService) { }
  private server = globals.serverPermit;
  private userPath = globals.server+"/user";
  private headers = this.tokenService.getHeader();
  findEmail(email:string){
    return this.http.get(this.server+"/find-email/"+email,{headers: this.headers,observe: 'response'});
  }
  login(email:string, password:string){
    let body = {email:email,password:password};
    return this.http.post(this.userPath+"/login",body,{headers: this.headers,observe: 'response'});
  }
}
