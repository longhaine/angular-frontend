import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleService} from '../service/title.service';
import { HeaderComponent } from '../header/header.component';
import { DataService } from '../service/data.service';
import { globals} from '../environtments';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../service/shop.service';
import { StatusService } from '../service/status.service';
import { Product } from '../class/product';
import { Subcategory } from '../class/subcategory';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../service/cart.service';
import { TokenService } from '../service/token.service';
import { Cart } from '../class/cart';
import { ProductOption } from '../class/product-option';
import { Filterable } from '../interface/filterable';
import { OptionWithSize } from '../class/option-with-size';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  constructor(private title: Title,
              private titleService: TitleService,
              private headerComponent:HeaderComponent,
              private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private shopService: ShopService,
              private statusService: StatusService,
              private cartService: CartService,
              private tokenService: TokenService,
              private changeRef: ChangeDetectorRef) { }
  private load:boolean = false;
  private headerSubscription:Subscription;
  private img = globals.server+"/img";
  private breadCrumbInformation:{gender:string, subCategoryName:string} = {gender:'', subCategoryName:''};
  private collections:string; // used in html template
  private filterDropdown:boolean = false; // used in html template
  private introTemplate:Object; // init introLine in environtments.ts
  private gender:string;
  private subCategoryName:string;
  private subCategories: Subcategory[] = [];
  private products: Product[] = [];
  private rawJsonProducts:string;
  private numberOfProduct:number = 0;
  private styles:Set<String> = new Set<String>();
  private colors:Set<String> = new Set<String>();
  private sizes:Set<String> = new Set<String>();
  private filteredProducts:Product[];
  private filterColors:Set<String> = new Set<String>();
  private filterSizes:Set<String> = new Set<String>();
  ngOnInit() {
    this.routeHandler();
  }
  setTitle(gender:string, subCategoryName: string){
    this.title.setTitle(this.titleService.shopComponentTitleHandler(gender,subCategoryName));
  }

  replaceLineBreaks(value:string){
    return value.replace(/\s/g,'-');
  }
  reset(){
    this.load = false;
    this.numberOfProduct = 0;
    this.styles.clear();
    this.colors.clear();
    this.sizes.clear();
    this.filterColors.clear();
    this.filterSizes.clear();
    this.filteredProducts = [];

  }
  scrollToElement(idName:string){
    let element:Element = document.getElementById(idName);
    element.scrollIntoView({behavior:"smooth",block:"start"});
  }
  initBreadCrumb(gender:string, subCategoryName:string){
    this.breadCrumbInformation.gender = gender;
    this.breadCrumbInformation.subCategoryName = subCategoryName;
  }
  routeHandler(){
    this.route.paramMap.subscribe(params =>{
      this.reset();
      this.gender = params.get("gender");
      this.subCategoryName = params.get("subCategoryName");
      if(this.gender === "men" || this.gender === "women"){
        this.initBreadCrumb(this.gender,this.subCategoryName);
        this.sideSubCategoryHander(this.gender);
        this.productHandler(this.gender,this.subCategoryName);
      }
      else{
        this.router.navigate(["/404"]);
      }
    })
  }
  sideSubCategoryHander(gender:string){
    this.shopService.sideSubCategoryByGender(gender)
    .subscribe(res =>{
      this.subCategories = JSON.parse(JSON.stringify(res.body));
    }, err=>{
      this.statusService.statusHandler(err.status);
    })
  }
  initStyle(products:Product[]){
    let length = products.length;
    for(let i = 0 ; i < length; i++)
    {
      if(this.styles.has(products[i].name) == false)
      {
        this.styles.add(products[i].name);
      }
    }
  }
  initColor(products:Product[]){
    let length = products.length;
    for(let i = 0; i < length; i++)
    {
      let length2 = products[i].productOptions.length;
      for(let j = 0; j < length2; j++)
      {
        if(this.colors.has(products[i].productOptions[j].color) == false)
        {
          this.colors.add(products[i].productOptions[j].color);
        }
      } 
    }
  }
  initSize(products:Product[]){
    let length = products.length;
    for(let i = 0 ; i < length ; i++)
    {
      let length2 = products[i].productOptions[0].optionWithSizes.length;
      for(let j = 0 ; j < length2; j++)
      {
        if(this.sizes.has(products[i].productOptions[0].optionWithSizes[j].size.code) == false)
        {
          this.sizes.add(products[i].productOptions[0].optionWithSizes[j].size.code);
        }
      }
      this.sizes.add("SEPARATE");
    }
    console.log(this.sizes);
  }
  addStyleFilter(style:String, target:Element){
    target.classList.toggle("--btn-style-check");
  }
  addColorFilter(color:String,target:Element){
    target.classList.toggle("--select-size-item");
    if(this.filterColors.has(color) == false)
    {
      this.filterColors.add(color);
      this.doFilter("color");
    }
    else{
      this.filterColors.delete(color);
      if(this.filterColors.size > 0)
      {
        this.doFilter("color");
      }
    }
  }
  addSizeFilter(size:String,target:Element){
    target.classList.toggle("--filter-size-item-check");
  }
  resetFilteredProducts(){
    this.filteredProducts = JSON.parse(this.rawJsonProducts);
  }
  doFilter(change:string){
    if(change === "style")
    {
      this.filteredProducts = this.doFilterStyle(this.products,this.styles);
      if(this.filterColors.size > 0){
        change = "color"; //continue to below
      }
    }
    if(change === "color")
    {
      this.resetFilteredProducts();
      for(let i = 0 ; i < this.filteredProducts.length ; i++)
      {
        let productOptions:ProductOption[] = this.doFilterColor(this.filteredProducts[i].productOptions,this.filterColors);
        if(productOptions.length > 0)
        {
          this.filteredProducts[i].productOptions = productOptions;
        }
        else{
          this.filteredProducts.splice(i,1);
          i--;
        }
      }
      if(this.filterSizes.size > 0){
        change = "size";
      }
    }
    if(change === "size")
    {
      if(this.filteredProducts.length == 0){
        this.filteredProducts = this.products;
      }
      let length = this.filteredProducts.length;
      for(let i = 0; i < length; i++)
      {
        let length2 = this.filteredProducts[i].productOptions.length;
        let notContain:boolean = false;
        for(let j = 0 ; j < length2 ;j++)
        {
          if(this.doFilterSize(this.filteredProducts[i].productOptions[j].optionWithSizes,this.filterSizes) == false)
          {
            notContain = true;
            break; 
          }
        }
        if(notContain == true)
        {
          this.filteredProducts.splice(i,1);
        }
      }
    }
    console.log(this.filteredProducts);
  }
  doFilterStyle(products:Product[],filter:Set<String>){
    let filtered:Product[] = [];
    let length = products.length;
    for(let i = 0; i < length ; i++){
      if(filter.has(products[i].name))
      {
        filtered.push(products[i]);
      }
    }
    return filtered;
  }
  doFilterColor(productOptions:ProductOption[],filter:Set<String>){
    let filtered:ProductOption[] = [];
    let length = productOptions.length;
    for(let i = 0 ; i < length ; i++)
    {
      if(filter.has(productOptions[i].color)){
        filtered.push(productOptions[i]);
      }
    }
    return filtered;
  }
  doFilterSize(optionWithSizes:OptionWithSize[],filter:Set<String>){
    let filtered:OptionWithSize[] = [];
    let length = optionWithSizes.length;
    for(let i = 0 ; i < length; i++)
    {
      if(filter.has(optionWithSizes[i].size.code) && optionWithSizes[i].quantity > 0){
        return true;
      }
    }
    return false;
  }
  initProductInformation(res:HttpResponse<Object>){
    this.products = JSON.parse(JSON.stringify(res.body));
    this.rawJsonProducts = JSON.stringify(res.body);
    this.initStyle(this.products);
    this.initColor(this.products);
    this.initSize(this.products);
    this.productCount(this.products);
    this.collections = globals.collections+this.gender+"/"+this.replaceLineBreaks(this.subCategoryName)+"/";
    this.introTemplate = this.dataService.getSubcategoryByGender(this.gender, this.subCategoryName);
  }
  productHandler(gender:string, subCategoryName:string){
    this.shopService.productByGenderAndSubCategory(gender,subCategoryName)
    .subscribe(res =>{
      this.setTitle(gender, subCategoryName);
      this.initProductInformation(res);
      this.load = true;
    },err=>{
      this.load = false;
      this.statusService.statusHandler(err.status);
    })
  }
  productCount(products:Product[]){
    products.forEach((product:Product)=>{
      this.numberOfProduct = this.numberOfProduct + product.productOptions.length;
    });
  }
  triggerHeaderComponent(status:string){
    this.dataService.changeMessage("knock");
    this.headerSubscription = this.dataService.headerMessageSubcriber.subscribe(message =>{
      if(message === "ready"){
        this.dataService.changeMessage(status);
      }
    });
  }
  addCart(id:number){
    this.dataService.changeMessage("cart loading");

    this.cartService.add(id).subscribe(res=>{
      let carts:Cart[] = [];
      if(res.body !== "")
      {
        carts = JSON.parse(JSON.stringify(res.body));
      }
      this.dataService.setCarts(carts);
      this.dataService.changeMessage("update carts");
      this.dataService.changeMessage("cart loading");
    })
  }
  ngAfterViewInit(){
    this.triggerHeaderComponent("off");
    
  }
  ngAfterViewChecked(){
    this.changeRef.detectChanges();
  }
  ngOnDestroy(){
    this.headerSubscription.unsubscribe();
  }
}
