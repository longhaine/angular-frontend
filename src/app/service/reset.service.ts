import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class ResetService {
  private permit:string = globals.serverPermit;
  private user:string = globals.server+"/user";
  private headers = this.tokenService.getHeader();
  constructor(private http: HttpClient,
    private tokenService:TokenService) { }

  sendResetLink(email:string){
    return this.http.get(this.permit+"/send-reset-link/"+email,{headers: this.headers,observe: 'response'});
  }
  checkResetLink(hashedPath:string){
    return this.http.get(this.permit+"/check-reset-link/"+hashedPath,{headers: this.headers,observe: 'response'});
  }
  resetPassword(hashedPath:string,password:string){
    let body = {password: password}
    return this.http.post(this.user+"/reset-password/"+hashedPath,body,{headers: this.headers,observe: 'response'});
  }
}
