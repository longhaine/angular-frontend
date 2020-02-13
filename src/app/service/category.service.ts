import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../environtments';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient,
              private tokenService: TokenService) { }
  private server = globals.serverPermit;
  private headers = this.tokenService.getHeader();
  getHeader(){
    return this.http.get(this.server+"/header",{headers: this.headers,observe: 'response'});
  }
}
