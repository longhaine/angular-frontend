import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(private headerComponent:HeaderComponent,
              private dataService: DataService) { }

  ngOnInit() {
    
  }
  ngAfterViewInit(){
    this.dataService.headerMessageSubcriber.subscribe(message =>{
      if(message === "ready"){
        console.log("received");
        this.dataService.changeMessage("received");
      }
    })
  }
}
