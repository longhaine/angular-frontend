import { Component } from '@angular/core';
import { ShopComponent } from './shop/shop.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-frontend';
  private shopComponent:ShopComponent;
  afterHeaderIsReady(){
  }
}
