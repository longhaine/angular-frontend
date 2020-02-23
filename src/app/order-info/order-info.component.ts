import { Component, OnInit } from '@angular/core';
import { globals } from '../environtments';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../class/order';
import { OrderService } from '../service/order.service';
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {
  private orders: Order[] = [];
  private order: Order;
  private collections = globals.collections;
  constructor(private modalService: NgbModal,
    private orderService: OrderService) { }

  openScrollableContent(longContent, order: Order){
    this.order = order;
    this.modalService.open(longContent, { scrollable: true });
  }
  ngOnInit() {
    this.orderService.getOrders().subscribe(res=>{
      if(res.body !== ""){
        this.orders = JSON.parse(JSON.stringify(res.body));
      }
    });
  }


}
