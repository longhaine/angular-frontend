import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleService} from '../service/title.service';
import { DataService } from '../service/data.service';
import { globals} from '../environtments';
import { ShopService } from '../service/shop.service';
import { StatusService } from '../service/status.service';
import { Product } from '../class/product';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../service/cart.service';
import { Cart } from '../class/cart';
import { ProductOption } from '../class/product-option';
import { Filterable } from '../interface/filterable';
import { OptionWithSize } from '../class/option-with-size';
import { Intro } from '../interface/intro';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['../collection/collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  constructor(private title: Title,
              private titleService: TitleService,
              private dataService: DataService,
              private shopService: ShopService,
              private statusService: StatusService,
              private cartService: CartService,
              private changeRef: ChangeDetectorRef) { }
  @Input() gender:string;
  @Input() subCategoryName:string;
  @Input() introTemplate:Intro;
  load = true;
  img = globals.server+"/img";
  collections:string; // used in html template
  filterDropdown:boolean = false; // used in html template
  products: Product[] = [];
  rawJsonProducts:string;
  numberOfProduct:number = 0;
  oneSize:boolean = false;
  styles:Map<String,Filterable> = new Map<String,Filterable>();
  groupColors:Map<String,Filterable> = new Map<String,Filterable>();
  sizes:Map<String,Filterable> = new Map<String,Filterable>();
  filteredProducts:Product[];
  filterStyles:Set<String> = new Set<String>();
  filterColors:Set<String> = new Set<String>();
  filterSizes:Set<String> = new Set<String>();
  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges){
    this.reset();
    this.productHandler(this.gender,this.subCategoryName);
  }
  trackByS(index,item){
    return index;
  }
  trackByM(index,item){
    return item.key;
  }
  trackByFn(index, item){
    return item.id;
  }
  originalOrder(){
    return 0;
  }
  setTitle(gender:string, subCategoryName: string){
    this.title.setTitle(this.titleService.shopComponentTitleHandler(gender,subCategoryName));
  }

  replaceLineBreaks(value:string){
    return value.replace(/\s/g,'-');
  }
  reset(){
    this.oneSize = false;
    this.load = true;
    this.filterDropdown = false;
    this.numberOfProduct = 0;
    this.styles.clear();
    this.groupColors.clear();
    this.sizes.clear();
    this.filterStyles.clear();
    this.filterColors.clear();
    this.filterSizes.clear();
    this.filteredProducts = [];
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
    // == 2 because it contains separate
    if(this.sizes.size == 2){
      this.oneSize = true;
    }
  }
  clearFilterables(filterable:Map<String,Filterable>){
    for(let key of filterable.keys()){
      filterable.set(key,{disabled:false,check:false});
    }
  }
  clearAll(){
    this.clearFilterables(this.styles);
    this.clearFilterables(this.groupColors);
    this.clearFilterables(this.sizes);
    this.filterStyles.clear();
    this.filterColors.clear();
    this.filterSizes.clear();
    this.resetFilteredProducts();
    this.productCount(this.filteredProducts);
  }
  toggleFilterables(key:String,filterable:Map<String,Filterable>){
    let disabled = filterable.get(key).disabled;
    let check = filterable.get(key).check;
    filterable.set(key,{disabled:disabled,check: !check });
  }
  toggleStyle(style:String){
    this.toggleFilterables(style,this.styles);
    if(this.filterStyles.has(style) == false)
    {
      this.filterStyles.add(style);
    }
    else{
      this.filterStyles.delete(style);
    }
    this.filterStyle();
    this.scanStyles(false);
    this.productCount(this.filteredProducts);
  }
  toggleColor(color:String){
    this.toggleFilterables(color,this.groupColors);
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
    }
    this.scanColors(false);
    this.productCount(this.filteredProducts);
  }
  toggleSize(size:String){
    this.toggleFilterables(size,this.sizes);
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
    }
    this.scanSizes();
    this.productCount(this.filteredProducts);
  }
  resetFilteredProducts(){
    this.filteredProducts = JSON.parse(this.rawJsonProducts);
  }
  resetFilterables(filterable:Map<String,Filterable>){
    for(let key of filterable.keys()){
      filterable.set(key,{disabled:false,check:filterable.get(key).check});
    }
  }
  disabledFilterables(filterable:Map<String,Filterable>){
    for(let key of filterable.keys()){
      let check = filterable.get(key).check;
      let disabled = true;
      if(check === true){
        disabled = false;
      }
      filterable.set(key,{disabled:disabled, check: check});
    }
  }
  scanStyles(scanned:boolean){
    if(this.filterStyles.size > 0){
      this.disabledFilterables(this.groupColors);
      
      let length = this.products.length;
      let scannedProducts:Product[] = [];
      for(let i = 0; i < length; i++){
        if(this.filterStyles.has(this.products[i].name)){
          let product = this.products[i];
          scannedProducts.push(JSON.parse(JSON.stringify(this.products[i])));
        }
      }
      let length2 = scannedProducts.length;
      for(let i = 0; i < length2; i++){
        let length3 = scannedProducts[i].productOptions.length;
        for(let j = 0 ; j < length3; j++){
          let keyColor = scannedProducts[i].productOptions[j].groupColor; 
          this.groupColors.set(keyColor,{disabled:false,check:this.groupColors.get(keyColor).check});
        }
      }
      if(this.filteredProducts.length > 0){
        this.disabledFilterables(this.sizes);
        let count = this.sizes.size;
        let length3 = this.filteredProducts.length
        loop:
        for(let i = 0; i < length3 ; i++){
          let length4 = this.filteredProducts[i].productOptions.length;
          for(let j = 0 ; j < length4; j++){
            let length5 = this.filteredProducts[i].productOptions[j].optionWithSizes.length;
            for(let k = 0; k < length5; k++){
              if(this.filteredProducts[i].productOptions[j].optionWithSizes[k].quantity > 0 
                && this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).disabled === true){
                
                this.sizes.set(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code,
                {disabled:false,check: this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).check});
                count = count - 1;
                if(count === 0){
                  break loop;
                }
              }
            }
          }
        }
      }
    }
    else{
      if(this.filterColors.size == 0 || this.filterSizes.size == 0){
        this.resetFilterables(this.groupColors);
        this.resetFilterables(this.sizes);
      }
      else{
        if(this.filterColors.size > 0){
          this.scanColors(true);
        }
        if(this.filterSizes.size > 0){
          this.scanSizes();
        }
      }
    }
    if(this.filterColors.size > 0 && this.filterStyles.size > 0 && scanned === false){
      this.scanColors(true);
    }
    if(this.filterSizes.size > 0 && this.filterStyles.size > 0){
      this.scanSizes();
    }
  }
  scanColors(scanned:boolean){
    if(this.filterColors.size > 0){
      this.disabledFilterables(this.styles);
      let length = this.products.length;
      let scannedProducts:Product[] = [];
      for(let i = 0 ; i < length; i++){
        let length2 = this.products[i].productOptions.length;
        let scannedProductOptions:ProductOption[] = [];
        for(let j = 0 ; j < length2 ; j++){
          if(this.filterColors.has(this.products[i].productOptions[j].groupColor) === true){
            scannedProductOptions.push(JSON.parse(JSON.stringify(this.products[i].productOptions[j])));
          }
        }
        if(scannedProductOptions.length > 0){
          let position = scannedProducts.push(JSON.parse(JSON.stringify(this.products[i])));
          scannedProducts[position - 1].productOptions = scannedProductOptions;
        }
      }
      let length2 = scannedProducts.length;
      for(let i = 0 ; i < length2 ;i++){
        this.styles.set(scannedProducts[i].name,{disabled:false, check: this.styles.get(scannedProducts[i].name).check})
      }
      if(this.filteredProducts.length > 0){
        this.disabledFilterables(this.sizes);
        let count = this.sizes.size;
        let length3 = this.filteredProducts.length
        loop:
        for(let i = 0; i < length3 ; i++){
          let length4 = this.filteredProducts[i].productOptions.length;
          for(let j = 0 ; j < length4; j++){
            let length5 = this.filteredProducts[i].productOptions[j].optionWithSizes.length;
            for(let k = 0; k < length5; k++){
              if(this.filteredProducts[i].productOptions[j].optionWithSizes[k].quantity > 0 
                && this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).disabled === true){
                
                this.sizes.set(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code,
                {disabled:false,check: this.sizes.get(this.filteredProducts[i].productOptions[j].optionWithSizes[k].size.code).check});
                count = count - 1;
                if(count === 0){
                  break loop;
                }
              }
            }
          }
        }
      }
    }
    else{
      if(this.filterStyles.size == 0 || this.filterSizes.size == 0){
        this.resetFilterables(this.styles);
        this.resetFilterables(this.sizes);
      }
      if(this.filterStyles.size > 0){
        this.scanStyles(true);
      }
      if(this.filterSizes.size > 0){
        this.scanSizes();
      }
    }
    if(this.filterStyles.size > 0 && this.filterColors.size > 0 && scanned === false){
      this.scanStyles(true);
    }
  }
  scanSizes(){
    if(this.filterSizes.size > 0){
      if(this.filterColors.size === 0){
        this.disabledFilterables(this.styles);
        let scannedProducts:Product[] = [];
        let length = this.products.length;
        for(let i = 0 ; i < length ; i++){
          let length2 = this.products[i].productOptions.length;
          let scannedProductOptions:ProductOption[] = [];
          loop:
          for(let j = 0; j < length2; j++){
            let length3 = this.products[i].productOptions[j].optionWithSizes.length;
            for(let k = 0; k < length3; k++){
              let optionWithSize:OptionWithSize = this.products[i].productOptions[j].optionWithSizes[k];
              if(this.filterSizes.has(optionWithSize.size.code)){
                scannedProductOptions.push(JSON.parse(JSON.stringify(this.products[i].productOptions[j])));
                break loop;
              }
            }
          }
          if(scannedProductOptions.length > 0){
            let position = scannedProducts.push(JSON.parse(JSON.stringify(this.products[i])));
            scannedProducts[position - 1].productOptions = scannedProductOptions;
          }
        }
        let length2 = scannedProducts.length;
        for(let i = 0; i < length2 ; i++){
          this.styles.set(scannedProducts[i].name,{disabled:false,check: this.styles.get(scannedProducts[i].name).check});
          let length3 = scannedProducts[i].productOptions.length;
        }
      }
      
      if(this.filterColors.size ===0){
        this.disabledFilterables(this.groupColors);
        let length3 = this.filteredProducts.length;
        for(let i = 0 ; i < length3; i++){
          let length2 = this.filteredProducts[i].productOptions.length;
          for(let j = 0 ; j < length2 ; j++){
            let key = this.filteredProducts[i].productOptions[j].groupColor;
            this.groupColors.set(key,{disabled:false, check: this.groupColors.get(key).check });
          }
        }
      }
      
    }
    else{
      if(this.filterStyles.size == 0 || this.filterColors.size == 0){
        this.resetFilterables(this.sizes);
        this.resetFilterables(this.styles);
        this.resetFilterables(this.groupColors);
      }
      if(this.filterStyles.size > 0){
        this.scanStyles(true);
      }
      if(this.filterColors.size > 0){
        this.scanColors(true);
      }
    }
  }
  filterStyle(){
    this.resetFilteredProducts();
    if(this.filterStyles.size > 0){
      this.filteredProducts = this.doFilterStyle(this.filteredProducts,this.filterStyles);
    }
    if(this.filterColors.size > 0 ){
      this.filterColor(true);
    }
    else if(this.filterSizes.size > 0){
      this.filterSize(true);
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
        return true;
      }
    }
    return false;
  }
  disabledBtnColor(colorKey:String,colorDisabled:boolean){
    if(colorDisabled === true){
      if(colorKey === "White" || colorKey === "Pink"){
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
    // this.filteredProducts = JSON.parse(JSON.stringify(res.body));
    this.products = JSON.parse(JSON.stringify(res.body));
    this.rawJsonProducts = JSON.stringify(res.body);
    this.resetFilteredProducts();
    
    this.collections = globals.collections+this.gender+"/"+this.replaceLineBreaks(this.subCategoryName)+"/";
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
      this.load = false;
      this.changeRef.detectChanges();
    },err=>{
      this.statusService.statusHandler(err.status);
      this.changeRef.detectChanges();
    })
  }
  productCount(products:Product[]){
    this.numberOfProduct = 0;
    products.forEach((product:Product)=>{
      this.numberOfProduct = this.numberOfProduct + product.productOptions.length;
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
}
