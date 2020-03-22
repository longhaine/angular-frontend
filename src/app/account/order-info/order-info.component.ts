import { Component, OnInit } from '@angular/core';
import { globals } from '../../environtments';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../../class/order';
import { OrderService } from '../../service/order.service';
import { DataService } from '../../service/data.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {
  orders: Order[] = [];
  order: Order;
  collections = globals.collections;
  verified:boolean = false;
  constructor(private modalService: NgbModal,
    private orderService: OrderService,
    private dataService:DataService,
    private title: Title) { }
  
  logOut(){
    this.dataService.deleteAllCookies();
    window.location.href="/";
  }
  openScrollableContent(longContent, order: Order){
    this.order = order;
    this.modalService.open(longContent, { scrollable: true });
  }
  ngOnInit() {
    this.title.setTitle("Orders | Everlane");
    if(this.dataService.checkCookieObject("email")){
      this.verified = true;
      this.orderService.getOrders().subscribe(res=>{
        if(res.body !== ""){
          this.orders = JSON.parse(JSON.stringify(res.body));
        }
      });
    }
    else{
      this.dataService.changeMessage("require login");// user hasn't login yet
    }
  }


}
