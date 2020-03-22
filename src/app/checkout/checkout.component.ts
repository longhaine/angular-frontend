import { Component, OnInit } from '@angular/core';
import { globals } from '../environtments';
import { Cart } from '../class/cart';
import { Address } from '../class/address';
import { Order } from '../class/order';
import { CartService } from '../service/cart.service';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { AddressService } from '../service/address.service';
import { OrderService } from '../service/order.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  creditForm: FormGroup;
  paymentMethod:string = "cod";
  selectedAddress: Address = null;
  submitted: boolean = false; // for address form
  submitted2: boolean = false;// for credit form
  collections = globals.collections;
  carts: Cart[] = [];
  subTotal: number = 0;
  shipping: number = 0;
  total: number = 0;
  order: Order = null;
  phase: string = "preview"; // there are 5 phases 1->PREVIEW, 2->SHIPPING, 3->BILLING, 4->REVIEW, 5->MESSAGE
  constructor(private cartService: CartService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private addressService:AddressService,
    private orderService: OrderService,
    private title: Title) {
      this.addressForm = this.formBuilder.group({
        fullname:'',
        address:'',
        phone:''
      });
      this.creditForm = this.formBuilder.group({
        credit:'',
        secret:'',
        expire:''
      })
    }
  trackByItem(index,item){
    return item.id;
  }
  // PHASE PREVIEW
  getCarts(){
    this.cartService.getCarts().subscribe(res=>{
      this.InitCarts(res.body);
    });
  }
  increaseCart(id:number){
    this.cartService.add(id).subscribe(res=>{
      this.InitCarts(res.body);
    });
  }
  decreaseCart(id:number){
    this.cartService.minusCart(id).subscribe(res=>{
      this.InitCarts(res.body);
    })
  }
  removeAllQuantityCart(id:number){
    this.cartService.deleteAllQuantityCart(id).subscribe(res=>{
      this.InitCarts(res.body);
    });
  }
  InitCarts(body:any){
    if(body == ""){
      this.carts = [];
    }
    else{
      this.carts = JSON.parse(JSON.stringify(body));
    }
    this.orderSummary(this.carts);
    this.dataService.setCarts(this.carts);
    this.dataService.changeMessage("update carts"); // update carts at header component
  }
  orderSummary(carts: Cart[]){
    this.subTotal = 0; //reset fee
    let length = carts.length;
    for(let i = 0; i < length ; i++)
    {
      this.subTotal = this.subTotal + carts[i].price;
    }

    if(this.subTotal > 0 && this.subTotal < 100) this.shipping = 5;
    else this.shipping = 0;
    
    this.total = this.subTotal + this.shipping;
  }
  continueToShipping(){
    if(this.dataService.checkCookieObject("email")){
      this.phase = "shipping";
      if(this.selectedAddress === null){
        this.initAddressForm();
      }
      window.scrollTo(0,0);
    }
    else{
      this.dataService.changeMessage("require login");
    }
  }
  // END PHASE PREVIEW

  // PHASE SHIPPING
  get f(){return this.addressForm.controls;}
  continueToBilling(value:any){
    this.submitted = true;
    if(this.addressForm.valid){
      this.phase = "billing";
      this.submitted = false;
    }
    else{
      return false;
    }
  }
  initAddressForm(){
    this.addressService.getSelectedAddress().subscribe(res =>{
      let body = JSON.parse(JSON.stringify(res.body));
      if(body.message === "yes"){
        this.selectedAddress = body.address;
        this.addressForm.controls.fullname.setValue(body.address.fullName);
        this.addressForm.controls.address.setValue(body.address.address);
        this.addressForm.controls.phone.setValue(body.address.phone);
      }
    });
  }
  // END PHASE SHIPPING

  // PHASE BILLING
  get creditF(){return this.creditForm.controls;}

  continueToReview(value:any){
    if(this.paymentMethod === "cod"){
      this.phase = 'review';
    }
    else{
      this.submitted2 = true;
      if(this.creditForm.valid){
        this.submitted2 = false;
        this.phase = 'review';
      }
      else{
        return false;
      }
    }
  }
  // END PHASE BILLING

  // PHASE REVIEW
  placeOrder(){
    let order = {
      fullName:this.addressForm.value.fullname,
      address: this.addressForm.value.address,
      phone: this.addressForm.value.phone,
      payment: this.paymentMethod
    }
    this.orderService.placeOrder(order).subscribe(res=>{
      this.carts = [];
      this.dataService.setCarts(this.carts);
      this.dataService.changeMessage("update carts");
      this.order = JSON.parse(JSON.stringify(res.body));
      this.phase = "message";
    })
  }
  ngOnInit() {
    window.scrollTo(0,0);
    this.getCarts();
    this.hoveringBag(false);
    this.title.setTitle("Checkout | Everlane");
  }
  hoveringBag(status: boolean){
    let bagButton = document.getElementsByClassName("bag-button").item(0);
    if(status == false){
      bagButton.classList.remove("dropdown-menu-right");
    }
    else{
      bagButton.classList.add("dropdown-menu-right");
    }
  }
  ngOnDestroy(){
    this.hoveringBag(true);
  }

}
