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
import { Intro } from '../interface/intro';
import { KeyValue } from '@angular/common';
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
  private introTemplate:Intro; // init introLine in environtments.ts
  private gender:string;
  private subCategoryName:string;
  private subCategories: Subcategory[] = [];
  private products: Product[] = [];
  private rawJsonProducts:string;
  private numberOfProduct:number = 0;
  private styles:Map<String,Filterable> = new Map<String,Filterable>();
  private groupColors:Map<String,Filterable> = new Map<String,Filterable>();
  private sizes:Map<String,Filterable> = new Map<String,Filterable>();
  private filteredProducts:Product[];
  private filterStyles:Set<String> = new Set<String>();
  private filterColors:Set<String> = new Set<String>();
  private filterSizes:Set<String> = new Set<String>();
  ngOnInit() {
    this.routeHandler();
  }
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
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
    this.groupColors.clear();
    this.sizes.clear();
    this.filterStyles.clear();
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
        this.styles.set(products[i].name,{disabled:false,check:false});
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
        if(this.groupColors.has(products[i].productOptions[j].groupColor) == false)
        {
          this.groupColors.set(products[i].productOptions[j].groupColor,{disabled:false,check:false});
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
          this.sizes.set(products[i].productOptions[0].optionWithSizes[j].size.code,{disabled:false,check:false});
        }
      }
      this.sizes.set("SEPARATE",{disabled:false,check:false});
    }
  }
  addStyleFilter(style:String){
    let disabled = this.styles.get(style).disabled;
    let check = this.styles.get(style).check;
    this.styles.set(style,{disabled:disabled,check: !check });
    if(this.filterStyles.has(style) == false)
    {
      this.filterStyles.add(style);
      this.filterStyle();
      this.scanSizes();
    }
    else{
      this.filterStyles.delete(style);
      this.filterStyle();
      this.scanSizes();
    }
    if(this.filterColors.size > 0 ){
      this.scanStyles();
    }
    
    console.log(this.filteredProducts);
  }
  addColorFilter(color:String){
    let disabled = this.groupColors.get(color).disabled;
    let check = this.groupColors.get(color).check;
    this.groupColors.set(color,{disabled:disabled, check: !check});
    if(this.filterColors.has(color) == false)
    {
      this.filterColors.add(color);
    }
    else{
      this.filterColors.delete(color);
    }
    if(this.filterStyles.size > 0){
      this.filterStyle();
    }
    else{
      this.filterColor(false);
      this.scanStyles();
    }
    if(this.filterColors.size === 0){
      this.resetFilterables(this.styles);
    }
    this.scanSizes();
    console.log(this.filteredProducts);
  }
  addSizeFilter(size:String){
    let disabled = this.sizes.get(size).disabled;
    let check = this.sizes.get(size).check;
    this.sizes.set(size,{disabled:disabled,check : !check});
    if(this.filterSizes.has(size) == false)
    {
      this.filterSizes.add(size);
    }
    else{
      this.filterSizes.delete(size);
    }
    if(this.filterStyles.size > 0){
      this.filterStyle();
    }
    else if(this.filterColors.size > 0){
      this.filterColor(false);
    }
    else{
      this.filterSize(false);
      this.scanColors();
    }
    if(this.filterSizes.size === 0){
      this.resetFilterables(this.sizes);
    }
    console.log(this.filteredProducts);
  }
  resetFilteredProducts(){
    this.filteredProducts = JSON.parse(this.rawJsonProducts);
  }
  resetFilterables(filterable:Map<String,Filterable>){
    for(let key of filterable.keys()){
      filterable.set(key,{disabled:false,check:filterable.get(key).check});
    }
  }
  scanStyles(){
    console.log("SCAN STYLES");
    let length = this.products.length;
    for(let key of this.styles.keys()){
      this.styles.set(key,{disabled:true,check:this.styles.get(key).check});
    }
    let contains:Set<String> = new Set<String>();
    for(let i = 0; i < length; i++){
      let length2 = this.products[i].productOptions.length;
      for(let j = 0; j < length2; j++){
        if(this.filterColors.has(this.products[i].productOptions[j].groupColor)){
          contains.add(this.products[i].name);
          break;
        }
      }
    }
    for(let key of this.styles.keys()){
      if(contains.has(key)){
        this.styles.set(key,{disabled:false,check:this.styles.get(key).check});
      }
      else{
        this.styles.set(key,{disabled:true,check:this.styles.get(key).check});
      }
    }
  }
  scanColors(){
    console.log("SCAN COLORS");
    if(this.filterStyles.size > 0){
      for(let key of this.groupColors.keys()){
        this.groupColors.set(key,{disabled:true, check: this.groupColors.get(key).check});
        console.log("1 "+key);
      }
      let length = this.filteredProducts.length;
      for(let i = 0 ; i < length; i++){
        let length2 = this.filteredProducts[i].productOptions.length;
        for(let j = 0 ; j < length2 ; j++){
          let key = this.filteredProducts[i].productOptions[j].groupColor;
          
          this.groupColors.set(key,{disabled:false, check: this.groupColors.get(key).check });
          console.log(key);
        }
      }
    }
    else{
      this.resetFilterables(this.groupColors);
    }
    if(this.filterSizes.size > 0 ){
      this.filterSize(true);
    }
    console.log("SCAN COLORS END");
  }
  scanSizes(){
    console.log("SCAN SIZES");
    if(this.filterColors.size > 0 || this.filterStyles.size > 0){
      let count = this.sizes.size;
      for(let key of this.sizes.keys()){
        this.sizes.set(key,{disabled:true,check:this.sizes.get(key).check});
        console.log("1 "+key);
      }
      let length = this.filteredProducts.length;
      loop:
      for(let i = 0; i< length ; i++){
        let length2 = this.filteredProducts[i].productOptions.length;
        for(let j = 0; j < length2; j++){
          let length3 = this.filteredProducts[i].productOptions[j].optionWithSizes.length;
          for(let k = 0; k < length3; k++){
            if(this.filteredProducts[i].productOptions[j].optionWithSizes[k].quantity > 0 
              && this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).disabled === true){
              
              this.sizes.set(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code,
              {disabled:false,check: this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).check});
              console.log(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code);
              count = count - 1;
              if(count === 0){
                break loop;
              }
            }
          }

        }
      }
    }
    console.log("END SCAN SIZES");
  }
  filterStyle(){
    this.resetFilteredProducts();
    if(this.filterStyles.size > 0){
      this.filteredProducts = this.doFilterStyle(this.filteredProducts,this.filterStyles);
    }
    this.scanColors();
    if(this.filterColors.size > 0 ){
      this.filterColor(true);
    }
  }
  filterColor(fromStyle:boolean){
    if(fromStyle === false && this.filterStyles.size === 0){
      this.resetFilteredProducts();
    }
    if(this.filterColors.size > 0 ){
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
    }
    if(this.filterSizes.size > 0){
      this.filterSize(true);
    }
  }
  filterSize(fromColor:boolean){
    if(fromColor === false && this.filterStyles.size === 0 && this.filterColors.size === 0){
      this.resetFilteredProducts();
    }
    if(this.filterSizes.size > 0){
      for(let i = 0 ; i < this.filteredProducts.length ; i++)
      {
        for(let j = 0 ; j < this.filteredProducts[i].productOptions.length ; j++)
        {
          let contains:boolean = this.doFilterSize(this.filteredProducts[i].productOptions[j].optionWithSizes,this.filterSizes);
          if(contains === false){
            this.filteredProducts[i].productOptions.splice(j,1);
            j--;
          }
        }
        if(this.filteredProducts[i].productOptions.length === 0){
          this.filteredProducts.splice(i,1);
          i--;
        }
      }
    }
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
      if(filter.has(productOptions[i].groupColor)){
        filtered.push(productOptions[i]);
      }
    }
    return filtered;
  }
  doFilterSize(optionWithSizes:OptionWithSize[],filter:Set<String>){
    let length = optionWithSizes.length;
    for(let i = 0 ; i < length; i++)
    {
      
      if(filter.has(optionWithSizes[i].size.code) && optionWithSizes[i].quantity > 0){
        console.log(optionWithSizes[i].quantity+" "+optionWithSizes[i].size.code);
        return true;
      }
    }
    return false;
  }
  disabledBtnColor(colorKey:String,colorDisabled:boolean){
    if(colorDisabled === true){
      if(colorKey === "White"){
        return "--disabled-color-white";
      }
      return "--disabled-color";
    }
    if(this.groupColors.get(colorKey).check === true){
      return "--select-item2";
    }
    return null;
  }
  initProductInformation(res:HttpResponse<Object>){
    this.products = JSON.parse(JSON.stringify(res.body));
    this.rawJsonProducts = JSON.stringify(res.body);
    this.collections = globals.collections+this.gender+"/"+this.replaceLineBreaks(this.subCategoryName)+"/";
    this.introTemplate = this.dataService.getSubcategoryByGender(this.gender, this.subCategoryName);
    this.initStyle(this.products);
    this.initColor(this.products);
    this.initSize(this.products);
    this.productCount(this.products);
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
