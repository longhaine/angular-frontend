import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../modal/modal.component';
import { CategoryService } from '../service/category.service';
import { Category } from '../class/category';
import { globals } from '../environtments';
import { HostListener } from '@angular/core';
import { DataService } from '../service/data.service';
import { CartService } from '../service/cart.service';
import { Cart } from '../class/cart';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  transparentTrigger:boolean = false;
  img = globals.server+"/img";
  categoriesOfWomen: Category[] = [];
  categoriesOfMen: Category[] = [];
  contentMenu = "women"; //default is always women
  contentModal:string
  banner:Element;
  requireLogin:boolean = false;
  cartLoading:boolean = false;
  collections = globals.collections;
  numberOfCarts:number = 0;
  constructor(private router: Router,
              private modalService: NgbModal,
              private categoryService: CategoryService,
              private dataService: DataService,
              private cartService: CartService){
  }
  @Input() userName:string;
  @Input() carts:Cart[] = [];
  setContentMenu(value:string){
    this.contentMenu = value;
  }
  reload(){
    setTimeout(function(){
      window.location.reload();
    },1000);
  }
  navigateToHome(){
    this.transparentTriggeringOn();
    this.router.navigate(['/']);
    window.scrollTo(0,0);
  }
  navigateTo(path:string){
    this.router.navigate([path]);
    window.scrollTo(0,0);
  }
  logOut(){
    this.dataService.deleteAllCookies();
    window.location.reload();
  }
  // open modal for component login or signup based on component variable
  openModal(component:string){
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.component = component;
    modalRef.result.then(res=>{
      // if guest has carts then merge the guest carts into user carts when user logins succesfully
      if(res === "success" && this.numberOfCarts > 0){
        this.cartService.merge().subscribe(res=>{
          this.reload()
        });
      }
      else{
        this.reload();
      }
    },reason=>{
      if(this.requireLogin){
        this.requireLogin = false; // set to default variable
        this.router.navigate(['/']);
      }
    });
  }
  getHeader(){
    this.categoryService.getHeader().subscribe(results =>{
      var json = JSON.parse(JSON.stringify(results.body));
      this.categoriesOfWomen = json.women;
      this.categoriesOfMen = json.men;
    })
  }
  headerOnHover(){
    this.unsetTransparentBanner();
  }
  headerOutHover(){
    let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
    if(scrollTop == 0 && this.transparentTrigger == true){
      this.setTransparerntBanner();
    }else{
      this.unsetTransparentBanner();
    }
  }
  transparentTriggeringOn(){
    this.transparentTrigger = true;
    this.setTransparerntBanner();
  }
  transparentTriggeringOff(){
    this.transparentTrigger = false;
    this.unsetTransparentBanner();
  }
  setTransparerntBanner(){
    this.banner.setAttribute("Style","background-color:unset");
    let headerItems : HTMLCollectionOf<Element> = this.banner.getElementsByClassName("header-item");
    headerItems.item(0).classList.remove("underline-item"); //women
    headerItems.item(1).classList.remove("underline-item"); //men
    headerItems.item(2).classList.remove("underline-item"); //about
  }
  unsetTransparentBanner(){
    this.banner.setAttribute("Style","background-color:white");
    let headerItems : HTMLCollectionOf<Element> = this.banner.getElementsByClassName("header-item");
    headerItems.item(0).classList.add("underline-item"); //women
    headerItems.item(1).classList.add("underline-item"); //men
    headerItems.item(2).classList.add("underline-item"); //about
  }

  @HostListener("window:scroll", [""])
  onWindowScroll() {
    let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
    if(scrollTop == 0 && this.transparentTrigger == true){
      this.setTransparerntBanner();
    }else{
      this.unsetTransparentBanner();
    }
  }
  // End Desktop banner header
  // Mobile banner header
  openDropdown:Element;
  closeDropdown:Element;
  dropdownStatus:boolean = false;
  mobileDropdownMenu:Element;
  btnCloseDropdown:Element;
  currentForcusContent:Element;
  initMobileMenu(){
    this.openDropdown = document.getElementById("openDropdown");
    this.closeDropdown = document.getElementById("closeDropdown");
    this.mobileDropdownMenu = document.getElementById("mobileDropdownMenu");
    this.btnCloseDropdown = document.getElementById("btnCloseDropdown");
    this.currentForcusContent = document.getElementById("women"); //default active content Menu;
  }
  interactMobileMenu(status:boolean){
    //d-none is display:none
    if(status){
      this.openDropdown.classList.add("d-none");
      this.closeDropdown.classList.remove("d-none");
      this.mobileDropdownMenu.classList.add("open-dropdown-menu");
      this.btnCloseDropdown.classList.remove("d-none");
    }
    else{
      this.openDropdown.classList.remove("d-none");
      this.closeDropdown.classList.add("d-none");
      this.mobileDropdownMenu.classList.remove("open-dropdown-menu");
      this.btnCloseDropdown.classList.add("d-none");
    }
  }
  setMobileContentMenu(value:string, target:Element){
    this.setContentMenu(value);
    this.currentForcusContent.classList.remove("category-item--active");
    this.currentForcusContent = target; // set new current forcus content
    this.currentForcusContent.classList.add("category-item--active");
  }
  ngOnInit() {
    this.getHeader();
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
    this.cartCount(this.carts);
  }
  cartCount(carts:Cart[]){
    this.numberOfCarts = 0; //reset whenever the user adds cart
    let length = carts.length;
    for(let i = 0; i < length; i++){
      this.numberOfCarts = this.numberOfCarts + carts[i].quantity;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.cartCount(this.carts);
  }
  ngAfterViewInit(){
    this.banner = document.getElementById("desktop-banner");
    this.transparentTriggeringOn();
    this.dataService.changeMessage('ready'); //alert for another component that the header component is ready.

    // listen to another component

    this.dataService.headerMessageSubcriber.subscribe(message=>{
      if(message === "knock"){
        this.dataService.changeMessage("ready");
      }
      if(message === "on"){
        this.transparentTriggeringOn();
      }
      if(message === "off"){
        this.transparentTriggeringOff();
      }
      if(message === "require login"){
        this.requireLogin = true;
        this.openModal("login");
      }
      if(message === "update carts"){
        this.carts = this.dataService.getCarts();
        this.cartCount(this.carts);
      }
      if(message === "cart loading"){
        this.cartLoading = !this.cartLoading;
      }
    });


    //Mobile banner header
    this.initMobileMenu();
  }
}
