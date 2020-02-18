import { Component } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { DataService } from './service/data.service';
import { CartService } from './service/cart.service';
import { Cart } from './class/cart';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Everlane';
  userName:string;
  carts : Cart[] = [];
  constructor(private dataService:DataService,
    private router:Router,
    private cartService:CartService){
  }
  updateInfo(){
    this.userName = this.dataService.getFullNameCookie();
    this.cartService.getCarts().subscribe(res=>{
      if(res.body == ""){
        this.carts = [];
      }
      else
      this.carts = JSON.parse(JSON.stringify(res.body));
    })
  }
  ngAfterViewInit(){
    this.router.events.subscribe(ev=>{
      if(ev instanceof NavigationEnd){
        this.updateInfo();
      }
    });
  }
}
