import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http:HttpClient,
    private tokenService:TokenService) { }

  private userPath = globals.server+"/user";
  private headers = this.tokenService.getHeader();

  signUp(email:string, password:string,fullName:string){
    let body = {email:email,password:password,fullName:fullName};
    return this.http.post(this.userPath+"/signup",body,{headers: this.headers,observe: 'response'});
  }
}
