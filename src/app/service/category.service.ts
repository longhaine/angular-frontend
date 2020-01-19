import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../globals';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient,
              private tokenService: TokenService) { }
  private server = globals.serverPermit;
  private headers = this.tokenService.getHeader();
  getCategory(){
    return this.http.get(this.server+"/category",{headers: this.headers,observe: 'response'});
  }
}
