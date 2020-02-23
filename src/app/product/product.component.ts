import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { globals } from '../environtments';
import { ActivatedRoute ,Router } from '@angular/router'
import { ProductService} from '../service/product.service';
import { Product } from '../class/product';
import { ProductOption } from '../class/product-option';
import { Size } from '../class/size';
import { OptionWithSize } from '../class/option-with-size';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private link: string;
  private collections:string = globals.collections;
  private product:Product;
  private selected:ProductOption;
  private images: string[]= [];
  private colorHover:boolean = false;
  private unselecteds:ProductOption[]=[];
  private indexHover:number;
  private selectedSize:OptionWithSize = null;
  private sizePosition:number;
  constructor(private route: ActivatedRoute,
    private router:Router,
    private productService:ProductService,
    private activateRoute:ActivatedRoute,
    private location : Location) { }
  ngOnInit() {
    this.routeHandler();
  }
  navigateTo(link:string){
    this.colorHover = false;
    this.link = link; // in order to change url and reselect selected production
    let url = this.router.createUrlTree(['/products',link],{relativeTo:this.activateRoute}).toString();
    this.location.go(url);
    // reselect selected production 
    this.getSelectedProductOption(this.product,this.link);
    if(this.selectedSize !== null){
      this.selectedSize = this.selected.optionWithSizes[this.sizePosition];
    }
  }
  scrollToElement(idName:string){
    let element:Element = document.getElementById(idName);
    element.scrollIntoView({behavior:"smooth",block:"start"});
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
  hoverColor(i:number,unselected:ProductOption){
    this.colorHover = true;
    this.indexHover = i;
    if(this.unselecteds[i] === undefined){
      // this.unselecteds[i] = {unselected: unselected, images: this.initImages(unselected)};
      this.unselecteds[i] = unselected;
      this.unselecteds[i].images = this.initImages(unselected); 
    }
  }
  handleHover(i:number):string{
    if(this.colorHover == true && this.indexHover == i){
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
      return "";
    }
  }
}
