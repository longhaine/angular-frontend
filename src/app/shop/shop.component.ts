import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(private headerComponent:HeaderComponent) { }

  ngOnInit() {
    
  }
  ngAfterViewInit(){
    this.headerComponent.transparentTriggeringOff();
  }
}
