import { Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { Location } from '@angular/common';
import { globals } from '../environtments';
import { ActivatedRoute ,Router } from '@angular/router'
import { ProductService} from '../service/product.service';
import { Product } from '../class/product';
import { ProductOption } from '../class/product-option';
import { OptionWithSize } from '../class/option-with-size';
import { CartService } from '../service/cart.service';
import { DataService } from '../service/data.service';
import { Cart } from '../class/cart';
import { Breadcrumb } from '../interface/breadcrumb';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  breadcrumbs:Breadcrumb[] = [];
  link: string;
  collections: string = globals.collections;
  product: Product;
  selected: ProductOption;
  images: string[]= [];
  numberOfImgOfHoverColor:number;
  colorHovering: boolean = false;
  unselecteds: ProductOption[]=[];
  indexHover: number;
  selectedSize: OptionWithSize = null;
  sizePosition: number;
  sizeHovering: boolean = false;
  sizeHover: OptionWithSize = null;
  disabledBtn: boolean = false;
  btnStatus: string = "ADD TO BAG";
  SELECTASIZEPLEASE: boolean = false;
  @ViewChildren('carouselItem') carouselItems:QueryList<any>;
  carouselObserver: Subscription
  observer:IntersectionObserver;
  carouselItemActive:number = 0;
  doneObserver:boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private cartService: CartService,
    private dataService: DataService,
    private sanitizer: DomSanitizer) { }
  ngOnInit() {
    window.scrollTo(0,0);
    this.routeHandler();
  }
  ngAfterViewInit(){
    this.observer = new IntersectionObserver(entries =>{
      console.log(entries);
      entries.forEach(entry=>{
        if(entry.isIntersecting == true && this.doneObserver == true){
          this.carouselItemActive = parseInt(entry.target.id);
          console.log(this.carouselItemActive);
        }
      });
    },{root:document.getElementById("cus-carousel"),threshold:0.25});
    this.carouselObserver = this.carouselItems.changes.subscribe(()=>{
      if(this.carouselItems.length == this.images.length){
        this.carouselItems.forEach((item) =>{
          this.observer.observe(item.nativeElement);
        });
        setTimeout(()=>{this.doneObserver = true},500);
      }
    });
  }
  ngOnDestroy(){
    this.observer.disconnect();
    this.carouselObserver.unsubscribe();
  }
  trackByIndex(index,item){
    return index;
  }
  initBreadCrumb(selected:ProductOption){
    this.breadcrumbs = [];
    let gender = this.product.gender.toString();
    let subCategory = this.product.subCategory.name.replace(/\s/g,'-');
    this.breadcrumbs.push({type:"collections",name:gender,gender:gender,subCategory:"all"});
    this.breadcrumbs.push({type:"collections",name:subCategory,gender:gender,subCategory:subCategory});
    this.breadcrumbs.push({type:"product",name:this.link});
  }
  navigateTo(link:string){
    this.colorHovering = false;
    this.link = link; // in order to change url and reselect selected production
    let url = this.router.createUrlTree(['/products',link],{relativeTo:this.activateRoute}).toString();
    this.location.go(url);
    // reselect selected production 
    this.getSelectedProductOption(this.product,this.link);
    if(this.selectedSize !== null){
      this.selectedSize = this.selected.optionWithSizes[this.sizePosition]; //reselect size of selected production
    }
  }
  scrollToElement(idName:string){
    let element:Element = document.getElementById("main"+idName);
    element.scrollIntoView({behavior:"smooth",block:"start"});
  }
  scrollToFirstMobileImage(){
    let element:Element = document.getElementById('0');
    element.scrollIntoView();
  }
  // RESET THE HEIGHT TWO IMAGE CONTAINERS WHEN HOVER COLOR
  resetHeightOfImageContainers(target:Element){
    if(this.colorHovering == true){
      let heightPerImg = target.children.item(1).clientHeight + 16;//16 is 1rem = mb-3 = margin-bottom: 1rem 
      let heightTarget = heightPerImg * this.numberOfImgOfHoverColor;
      if(target.className.includes('side-image-container')){
        heightTarget = heightTarget + 17;
      }
      return this.sanitizer.bypassSecurityTrustStyle('max-height:'+ heightTarget +'px; height: '+ heightTarget + 'px;');
    }
    return null;
  }
  routeHandler(){
    this.route.paramMap.subscribe(params =>{
      this.link = params.get("link");
      this.productService.getByProductOptionLink(this.link).subscribe(res=>{
        this.product = JSON.parse(JSON.stringify(res.body));
        this.getSelectedProductOption(this.product,this.link);
      },error=>{this.router.navigate(["/404"]);})
    });
  }
  getSelectedProductOption(product:Product,link:string){
    let length = product.productOptions.length;
    for(let i = 0 ; i < length; i++){
      if(product.productOptions[i].link === link)
      {
        this.selected = product.productOptions[i];
        this.images = this.initImages(this.selected);
        this.initBreadCrumb(this.selected);
        break;
      }
    }
    if(this.selected.optionWithSizes.length === 1){
      this.sizePosition = 0;
      this.selectedSize = this.selected.optionWithSizes[0];
      if(this.selectedSize.quantity === 0){
        this.disabledBtn = true;
      }
    }
    
  }
  initImages(productOption:ProductOption):string[]{
    let numberOfImage = productOption.numberOfImage;
    let images: string[] = [];
    let gender = this.collections +this.product.gender;
    let subCategory = this.product.subCategory.name.replace(/\s/g,'-');
    for(let i = 1 ; i <= numberOfImage; i++)
    {
      images.push(gender +"/"+ subCategory +"/"+ productOption.image+'-'+i+'.jpg');
    }
    return images;
  }
  colorMouseOver(i:number,unselected:ProductOption){
    this.colorHovering = true;
    this.indexHover = i;
    this.numberOfImgOfHoverColor = unselected.numberOfImage;
    if(this.unselecteds[i] === undefined){
      // this.unselecteds[i] = {unselected: unselected, images: this.initImages(unselected)};
      this.unselecteds[i] = unselected;
      this.unselecteds[i].images = this.initImages(unselected);
    }
    this.handleBtn();
  }
  colorMouseOut(){
    this.colorHovering = false
    this.handleBtn();
  }
  handleHover(i:number):string{
    if(this.colorHovering == true && this.indexHover == i){
      return "d-block"; 
    }else{
      return "d-none";
    }
  }
  handleSize(optionWithSize:OptionWithSize):string{
    if(this.selectedSize === null)
    {
      return '';
    }
    if(this.selectedSize.size.code === optionWithSize.size.code){
      return "--select-size-item";
    }
    else{
      return '';
    }
  }
  sizeMouseOver(optionWithSize:OptionWithSize){
    this.sizeHovering = true;
    this.sizeHover = optionWithSize;
    this.handleBtn();
  }
  sizeMouseOut(){
    this.sizeHovering = false
    this.handleBtn();
  }
  handleBtn(){
    this.disabledBtn = this.handleDisabledBtn();
    if(this.disabledBtn == true){
      this.btnStatus = "SOLD OUT";
    }
    else{
      this.btnStatus = "ADD TO BAG";
    }
  }
  handleDisabledBtn():boolean{
    if(this.selectedSize == null && this.sizeHover == null){
      return false;
    }
    if(this.colorHovering == true && this.sizePosition !== undefined){
      let quantity = this.unselecteds[this.indexHover].optionWithSizes[this.sizePosition].quantity;
      if(quantity <= 0){ return true;}
      else return false;
    }
    if(this.sizeHovering == true){
      if(this.sizeHover.quantity <= 0){return true;}
      else return false;
    }
    if(this.selectedSize == null){
      return false;
    }
    if(this.selectedSize.quantity <= 0){
      return true;
    }
    else{
      return false;
    }
  }
  addToBag(){
    if(this.selectedSize === null){
      this.SELECTASIZEPLEASE = true;
    }
    else{
      this.disabledBtn = true;
      this.btnStatus = "ADDING...";
      this.dataService.changeMessage("cart loading");
      this.cartService.add(this.selectedSize.id).subscribe(res=>{
        let carts:Cart[] = JSON.parse(JSON.stringify(res.body));
        this.dataService.setCarts(carts);
        this.dataService.changeMessage("update carts");
        this.dataService.changeMessage("cart loading");
        this.handleBtn();
      })
    }
  }
}
