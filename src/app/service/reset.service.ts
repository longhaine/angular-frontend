import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class ResetService {
  private server:string = globals.serverPermit;
  private headers = this.tokenService.getHeader();
  constructor(private http: HttpClient,
    private tokenService:TokenService) { }

  sendResetLink(email:string){
    return this.http.get(this.server+"/send-reset-link/"+email,{headers: this.headers,observe: 'response'});
  }
}
