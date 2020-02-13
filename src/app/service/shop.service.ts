import { Injectable } from '@angular/core';
import { globals } from '../environtments';
import { HttpClient } from '@angular/common/http';
import { TokenService} from './token.service';
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private http: HttpClient,
              private tokenService: TokenService) { }
  server = globals.serverPermit;
  private headers = this.tokenService.getHeader();
  
  productByGenderAndSubCategory(gender:string, subCategoryName:string){
    return this.http.get(
      this.server+"/productByGenderAndSubcategory/"+gender+"/"+subCategoryName
    ,{headers: this.headers,observe: 'response'});
  }
  sideSubCategoryByGender(gender:string){
    return this.http.get(
      this.server+"/sideSubCategoryByGender/"+gender
      ,{headers: this.headers,observe: 'response'});
  }
}
