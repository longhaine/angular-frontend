import { Component, OnInit, HostListener} from '@angular/core';
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
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private link: string;
  private collections: string = globals.collections;
  private product: Product;
  private selected: ProductOption;
  private images: string[]= [];
  private colorHovering: boolean = false;
  private unselecteds: ProductOption[]=[];
  private indexHover: number;
  private selectedSize: OptionWithSize = null;
  private sizePosition: number;
  private sizeHovering: boolean = false;
  private sizeHover: OptionWithSize = null;
  private disabledBtn: boolean = false;
  private btnStatus: string = "ADD TO BAG";
  private SELECTASIZEPLEASE: boolean = false;
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
  // @HostListener("window:scroll", ["$event"])
  // onWindowScroll() {
  //   let length = this.images.length;
  //   if(length > 0){
  //     for(let i = 0; i < length ; i++){
  //       let bounding = document.getElementById(i.toString()).getBoundingClientRect();
  //       if (bounding.top >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
  //         document.getElementById("side_"+i).classList.add("--item-link-active");
  //       }
  //     }
  //   }
  // }
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
    let element:Element = document.getElementById(idName);
    element.scrollIntoView({behavior:"smooth",block:"start"});
  }

  // RESET THE HEIGHT TWO IMAGE CONTAINERS WHEN HOVER COLOR
  resetHeightOfImageContainers(target:Element){
    if(this.colorHovering == true){
      let heightPerImg = target.children.item(1).clientHeight + 16;//16 is 1rem = mb-3 = margin-bottom: 1rem 
      let heightTarget = heightPerImg * 6;
      if(target.className.includes('side-image-container')){
        heightTarget = heightTarget + 17;
      }
      return this.sanitizer.bypassSecurityTrustStyle('height:'+ heightTarget +'px;');
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
        break;
      }
    }
  }
  initImages(productOption:ProductOption):string[]{
    let numberOfImage = productOption.numberOfImage;
    let images: string[] = [];
    for(let i = 1 ; i <= numberOfImage; i++)
    {
      images.push(this.collections +this.product.gender
        +"/"+this.product.subCategory.name.replace(/\s/g,'-') +"/"+ productOption.image+'-'+i+'.jpg');
    }
    return images;
  }
  colorMouseOver(i:number,unselected:ProductOption){
    this.colorHovering = true;
    this.indexHover = i;
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
