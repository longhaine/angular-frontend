import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private router:Router) { }

  statusHandler(status:number){
    if(status == 404){
      this.router.navigate(["/404"]);
    }
  }
}
