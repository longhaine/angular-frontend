import { Component, OnInit,Input, SimpleChanges, ViewChild,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleService} from '../service/title.service';
import { DataService } from '../service/data.service';
import { globals} from '../environtments';
import { ShopService } from '../service/shop.service';
import { StatusService } from '../service/status.service';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../service/cart.service';
import { Cart } from '../class/cart';
import { Filterable } from '../interface/filterable';
import { Intro } from '../interface/intro';
import { Slide } from '../class/slide';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Subcategory } from '../class/subcategory';
import { ProductOption } from '../class/product-option';
import { OptionWithSize } from '../class/option-with-size';
@Component({
  selector: 'app-shop2',
  templateUrl: './shop2.component.html',
  styleUrls: ['../collection/collection.component.css','./shop2.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Shop2Component implements OnInit {

  constructor(private title: Title,
    private titleService: TitleService,
    private dataService: DataService,
    private shopService: ShopService,
    private statusService: StatusService,
    private cartService: CartService,
    private changeDetector:ChangeDetectorRef) { 

    }
  @Input() gender:string;
  @Input() subCategoryName:string;
  @Input() introTemplate:Intro;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('carousel3', {static : true}) carousel3: NgbCarousel;
  load = true;
  img = globals.server+"/img";
  collections:string; // used in html template
  filterDropdown:boolean = false; // used in html template
  subCategories: Subcategory[] = [];
  originSubCategoryCount:number = 0;
  rawJsonCategories:string;
  minifyJsonCategories:string;
  numberOfProduct:number = 0;
  oneSize:boolean = false;
  onFiltering:boolean = false;
  slides:Slide[] = [];
  slides3:Slide[] = [];
  selectedSubCategory:string;
  groupColors:Map<String,Filterable> = new Map<String,Filterable>();
  sizes:Map<String,Filterable> = new Map<String,Filterable>();
  filteredSubCategories:Subcategory[];
  filterSubCategory:String = "none";
  filterColors:Set<String> = new Set<String>();
  filterSizes:Set<String> = new Set<String>();
  filterCount:number = 0;
  categoryAll:String;
  slidePosition:number;
  categoryKey:String;
  ngOnChanges(changes:SimpleChanges){
    this.reset();
    this.productHandler(this.gender,this.subCategoryName);
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
    this.load = true;
    this.filterDropdown = false;
    this.numberOfProduct = 0;
    this.slides = [];
    this.slides3 = [];
    this.groupColors.clear();
    this.sizes.clear();
    this.filterSubCategory = "none";
    this.filterColors.clear();
    this.filterSizes.clear();
    this.filteredSubCategories = [];
  }
  trackByIndex(index,item){
    return index;
  }
  trackByKey(index,item){
    return item.key;
  }
  trackById(index,item){
    if(!item) return null;
    return item.id;
  }
  turnOffNavigator(){
    let show = true;
    if(this.slides.length == 1){
      show = false;
    }
    this.carousel.showNavigationArrows = show;
    this.carousel.showNavigationIndicators = show;
  }
  initCategory(categoriesProduct:Subcategory[]){
    this.categoryAll = "All "+this.gender+"'s";
    this.slidePosition = 0;
    this.categoryKey = this.categoryAll;
    let length = categoriesProduct.length;
    let j = 0;
    this.slides[j] = new Slide();
    this.slides[j].filterable = new Map<String,Filterable>(); 
    this.slides[j].filterable.set(this.categoryAll,{disabled:false,check:true});
    for(let i = 0 ; i < length; i++){
      if(this.slides[j].filterable.size === 6){
        j++
        this.slides[j] = new Slide();
        this.slides[j].filterable = new Map<String,Filterable>();
      }
      this.slides[j].filterable.set(this.subCategories[i].name,{disabled:false,check:false});
    }
    this.turnOffNavigator(); // turn off if the slides only have 1 
  }
  initColor(categoriesProduct:Subcategory[]){
    let length = categoriesProduct.length;
    let filterable:Filterable = {disabled:false,check:false};
    for(let i = 0; i < length; i++)
    {
      let length2 = categoriesProduct[i].products.length;
      for(let j = 0; j < length2; j++)
      {
        let length3 = this.subCategories[i].products[j].productOptions.length;
        for(let k = 0; k < length3; k++)
        {
          let groupColor = this.subCategories[i].products[j].productOptions[k].groupColor;
          if(this.groupColors.has(groupColor)=== false){
            this.groupColors.set(groupColor,filterable);
          }
        }
      } 
    }
  }
  initSize(categoriesProduct:Subcategory[],selectedCategory:String){
    this.oneSize = false;
    this.sizes.clear();
    let length = categoriesProduct.length;
    let filterable:Filterable = {disabled:false,check:false};
    loop:
    for(let i = 0 ; i < length ; i++)
    {
      if(categoriesProduct[i].name === selectedCategory)
      {
        let length2 = categoriesProduct[i].products.length;
        for(let j = 0 ; j < length2; j++)
        {
          let length3 = categoriesProduct[i].products[j].productOptions[0].optionWithSizes.length;
          for(let k = 0; k < length3; k++)
          {
            let size = this.subCategories[i].products[j].productOptions[0].optionWithSizes[k].size.code;
            if(this.sizes.has(size) === false){
              this.sizes.set(size,filterable);
            }
          }
          this.sizes.set("SEPARATE",filterable);
        }
        break loop;
      }
    }

    // == 2 because it contains separate
    if(this.sizes.size == 2){
      this.oneSize = true;
    }else{
      let position = 0;
      this.slides3[position] = new Slide();
      this.slides3[position].filterable = new Map<String,Filterable>();
      for(let key of this.sizes.keys())
      {
        if(key === "SEPARATE")
        {
          position++;
          this.slides3[position] = new Slide();
          this.slides3[position].filterable = new Map<String,Filterable>();
        }
        else{
          this.slides3[position].filterable.set(key,filterable);
        }
      }
      this.sizes.delete("SEPARATE");
      if(this.slides3[position].filterable.size === 0)
      {
        this.slides3.splice(position,1);

      }
    }
    let controller = false;
    if(this.slides3.length > 1){
      controller = true;
    }
    this.carousel3.showNavigationArrows = controller;
    this.carousel3.showNavigationIndicators = controller;
  }
  countFilters(){
    this.filterCount = this.filterColors.size + this.filterSizes.size;
    if(this.filterSubCategory != "none"){
      this.filterCount++;
    }
  }
  toggleFilterables(key:String,filterable:Map<String,Filterable>){
    let disabled = filterable.get(key).disabled;
    let check = filterable.get(key).check;
    filterable.set(key,{disabled:disabled,check: !check });
  }
  toggleFilter(){
    this.filterDropdown = !this.filterDropdown;
    if(window.innerWidth < 768 && this.filterDropdown == true){
      let element: Element = document.getElementById("filter-dropdown-section");
      element.scrollIntoView({block:"start"});
    }
  }
  toggleFilters(key:String,filter:Set<String>){
    if(filter.has(key) == false)
    {
      filter.add(key);
      return true;
    }
    else{
      filter.delete(key);
      return false;
    }
  }
  resetSlides(slides:Slide[]){
    slides.forEach(slide =>{
      for(let key of slide.filterable.keys()){
        let check = slide.filterable.get(key).check;
        slide.filterable.set(key,{disabled: false,check:check});
      }
    });
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
  clearFilterables(filterable:Map<String,Filterable>){
    for(let key of filterable.keys()){
      filterable.set(key,{disabled:false,check:false});
    }
  }
  uncheckCategory(){
    this.slides[this.slidePosition].filterable.set(this.categoryKey,{disabled:false,check:false});
  }
  checkCategory(slidePosition:number,categoryKey:String){
    this.slides[slidePosition].filterable.set(categoryKey,{disabled:false,check:true});
    this.slidePosition = slidePosition;
    this.categoryKey = categoryKey;
    if(categoryKey === this.categoryAll){
      this.filterSubCategory = "none";
    }
    else{
      this.filterSubCategory = categoryKey;
    }
  }
  resetToCategoryAll(){
    this.uncheckCategory();
    this.checkCategory(0,this.categoryAll);
    this.slides3 = [];
    this.sizes.clear();
  }
  clearAll(){
    this.filterColors.clear();
    this.clearFilterables(this.groupColors);
    this.toggleCategory(0,this.categoryAll);
    this.filterCount = 0;
  }
  toggleCategory(position:number,key:String){
    if(key === this.categoryAll && this.slides[0].filterable.get(this.categoryAll).check === false){
      this.uncheckCategory();
      this.resetToCategoryAll();
      this.resetFilterables(this.groupColors);
      this.filterSizes.clear();
      this.onFiltering = false;
    }
    else{
      if(this.slides[position].filterable.get(key).check == false){
        this.uncheckCategory();
        this.checkCategory(position,key);
        this.initSize(this.subCategories,key);
        this.scanSubCategory();
        this.onFiltering = true;
      }
      else{
        this.resetToCategoryAll();
        this.resetFilterables(this.groupColors);
        this.filterSizes.clear();
        this.onFiltering = false;
      }
    }
    if(this.filterColors.size > 0){
      if(this.filterSubCategory === "none"){
        this.fullSubCategories();
      }
      else{
        this.filterCategory();
        this.scanSubCategory();
      }
      this.filterColor();
      this.scanColors();
    }
    else{
      this.filterCategory();
    }
    console.log(key);
    if(this.filterSubCategory === "none"){
      this.productCount(this.subCategories);
    }
    else{
      this.productCount(this.filteredSubCategories);
    }
    this.countFilters();
  }
  toggleColor(key:String){
    this.toggleFilterables(key,this.groupColors);
    let addMore = this.toggleFilters(key,this.filterColors);
    if(addMore === true && this.filterSubCategory === "none")
    {
      this.fullSubCategories();
    }
    if(addMore === true && this.filterSubCategory !== "none"){
      this.filterCategory();
    }
    if(addMore === false && this.filterSubCategory !== "none"){
      this.scanSubCategory();
    }
    this.filterColor();
    this.scanColors();
    if(this.filterSizes.size > 0){
      this.filterSize();
      if(this.filterColors.size == 0){
        this.scanSizes();
      }
    }
    this.productCount(this.filteredSubCategories);
    this.countFilters();
  }
  removeSize(key:String){
    let position = 0;
    for(let i = 0; i < this.slides3.length; i++){
      if(this.slides3[i].filterable.has(key)){
        position = i;
        break;
      }
    }
    this.toggleSize(position,key);
  }
  toggleSize(position:number,key:String){
    this.toggleFilters(key,this.filterSizes);
    let disabled = this.slides3[position].filterable.get(key).disabled;
    let check = false;
    if(this.slides3[position].filterable.get(key).check === false){
      check = true;
    }
    this.slides3[position].filterable.set(key,{disabled:disabled,check:check});
    this.filterCategory();
    this.scanSubCategory();
    if(this.filterColors.size > 0){
      this.filterColor();
      this.scanColors();
    }
    this.filterSize();
    if(this.filterColors.size === 0){
      this.scanSizes();
    }
    this.productCount(this.filteredSubCategories);
    this.countFilters();
  }
  disabledSildes(slides:Slide[]){
    slides.forEach(slide =>{
      for(let key of slide.filterable.keys()){
        let check = slide.filterable.get(key).check;
        slide.filterable.set(key,{disabled:true,check:check});
      }
    })
  }
  enableSlideFilterable(slides:Slide[],key:String){
    slides.forEach(slide => {
      if(slide.filterable.has(key) && slide.filterable.get(key).disabled === true)
      {
        let sizeCheck = slide.filterable.get(key).check;
        slide.filterable.set(key,{disabled:false,check:sizeCheck});
      }
    });
  }
  categoryAllEnableDefault(){
    let check = this.slides[0].filterable.get(this.categoryAll).check;
    this.slides[0].filterable.set(this.categoryAll,{disabled:false,check:check});
  }
  scanSubCategory(){
    if(this.filterSubCategory !== "none"){
      this.disabledFilterables(this.groupColors);
      this.disabledSildes(this.slides3);
      let sizeChangeLeft = this.sizes.size;
      let length = this.subCategories.length;
      for(let i = 0; i < length ; i++)
      {
        if(this.subCategories[i].name === this.filterSubCategory)
        {
          let length2 = this.subCategories[i].products.length;
          for(let j = 0 ; j < length2; j++)
          {
            let length3 = this.subCategories[i].products[j].productOptions.length;
            for(let k = 0; k < length3; k++)
            {
              let colorKey = this.subCategories[i].products[j].productOptions[k].groupColor;
              let colorCheck = this.groupColors.get(colorKey).check;
              this.groupColors.set(colorKey,{disabled:false,check:colorCheck});
              let length4 = this.subCategories[i].products[j].productOptions[k].optionWithSizes.length;
              if(sizeChangeLeft > 0)
              {
                for(let l = 0; l < length4; l++)
                {      
                  let quantity = this.subCategories[i].products[j].productOptions[k].optionWithSizes[l].quantity;
                  if(quantity > 0)
                  {
                    let sizeKey = this.subCategories[i].products[j].productOptions[k].optionWithSizes[l].size.code;
                    this.slides3.forEach(slide => {
                      if(slide.filterable.has(sizeKey) && slide.filterable.get(sizeKey).disabled === true)
                      {
                        let sizeCheck = slide.filterable.get(sizeKey).check;
                        slide.filterable.set(sizeKey,{disabled:false,check:sizeCheck});
                        sizeChangeLeft--;
                      }
                    });
                  }
                }
              }
            }
          }
          break;
        }
      }
    }
  }
  scanColors(){
    if(this.filterColors.size > 0){
      this.disabledSildes(this.slides);
      this.categoryAllEnableDefault();
      let length = this.subCategories.length;
      for(let i = 0 ; i < length ; i++)
      {
        let length2 = this.subCategories[i].products.length;
        let containColor = false;
        loop:
        for(let j = 0 ; j <length2 ; j++)
        {
          let length3 = this.subCategories[i].products[j].productOptions.length;
          for(let k = 0; k < length3; k++)
          {
            let colorKey = this.subCategories[i].products[j].productOptions[k].groupColor;
            if(this.filterColors.has(colorKey))
            {
              containColor = true;
              break loop;
            }
          }
        }
        if(containColor === true)
        {
          this.enableSlideFilterable(this.slides,this.subCategories[i].name);
        }
      }
      if(this.filterSubCategory !== "none")
      {
        this.disabledSildes(this.slides3);
        let sizeChangeLeft = this.sizes.size;
        let length2 = this.filteredSubCategories.length;
        loop:
        for(let i = 0 ; i < length2; i++)
        {
          let length3 = this.filteredSubCategories[i].products.length;
          for(let j = 0; j < length3; j++)
          {
            let length4 = this.filteredSubCategories[i].products[j].productOptions.length;
            for(let k = 0 ; k < length4; k++)
            {
              let length5 = this.filteredSubCategories[i].products[j].productOptions[k].optionWithSizes.length;
              for(let l = 0 ; l < length5 ; l++)
              {
                let quantity = this.filteredSubCategories[i].products[j].productOptions[k].optionWithSizes[l].quantity;
                if(quantity > 0)
                {
                  let sizeKey = this.filteredSubCategories[i].products[j].productOptions[k].optionWithSizes[l].size.code;
                  this.slides3.forEach(slide => {
                    if(slide.filterable.has(sizeKey) && slide.filterable.get(sizeKey).disabled === true)
                    {
                      let sizeCheck = slide.filterable.get(sizeKey).check;
                      slide.filterable.set(sizeKey,{disabled:false,check:sizeCheck});
                      sizeChangeLeft--;
                    }
                  });
                  if(sizeChangeLeft == 0){
                    break loop;
                  }
                }
              }
            }
          }
        }
      }
    }
    else{
      this.resetSlides(this.slides);
      this.resetSlides(this.slides3);
    }
  }
  scanSizes(){
    if(this.filterSizes.size > 0){
      this.disabledFilterables(this.groupColors);
      let length = this.filteredSubCategories.length;
      for(let i = 0; i < length ; i++){
        let length2 = this.filteredSubCategories[i].products.length;
        for(let j = 0 ; j < length2; j++)
        {
          let length3 = this.filteredSubCategories[i].products[j].productOptions.length;
          for(let k = 0; k < length3; k++)
          {
            let colorKey = this.filteredSubCategories[i].products[j].productOptions[k].groupColor;
            let check = this.groupColors.get(colorKey).check;
            this.groupColors.set(colorKey,{disabled:false,check:check});
          }
        }
      }
    }
  }
  minifiedSubCategories(){
    this.filteredSubCategories = JSON.parse(this.minifyJsonCategories);
  }
  fullSubCategories(){
    this.filteredSubCategories = JSON.parse(this.rawJsonCategories);
  }
  filterCategory(){
    if(this.filterSubCategory!== "none"){
      this.fullSubCategories();
      this.filteredSubCategories = this.doFilterCategory(this.filteredSubCategories,this.filterSubCategory);
    }
    else{
      this.resetSlides(this.slides);
      this.minifiedSubCategories();
    }
  }
  doFilterCategory(categories:Subcategory[],filter:String){
    let filtered:Subcategory[] = [];
    let length = categories.length;
    for(let i = 0 ; i < length ;i++){
      if(categories[i].name === filter){
        filtered.push(categories[i]);
      }
    }
    return filtered;
  }
  filterColor(){
    if(this.filterColors.size > 0){
      this.onFiltering = true;
      for(let i = 0; i < this.filteredSubCategories.length; i++){
        for(let j = 0; j < this.filteredSubCategories[i].products.length; j++){
          let productOptions:ProductOption[] = this.doFilterColor(this.filteredSubCategories[i].products[j].productOptions,this.filterColors);
          if(productOptions.length > 0){
            this.filteredSubCategories[i].products[j].productOptions = productOptions;
          }
          else{
            this.filteredSubCategories[i].products.splice(j,1);
            j--;
          }
        }
        if(this.filteredSubCategories[i].products.length === 0){
          this.filteredSubCategories.splice(i,1);
          i--;
        }
      }
    }
    else{
      if(this.filterSubCategory === "none"){
        this.minifiedSubCategories();
        this.onFiltering = false;
      }
      else{
        this.filterCategory();
      }
    }
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
  filterSize(){
    if(this.filterSizes.size > 0){
      for(let i = 0; i < this.filteredSubCategories.length; i++){
        for(let j = 0; j < this.filteredSubCategories[i].products.length; j++){
          for(let k = 0; k < this.filteredSubCategories[i].products[j].productOptions.length; k++){
            let contains:boolean = this.doFilterSize(this.filteredSubCategories[i].products[j].productOptions[k].optionWithSizes,this.filterSizes);
            if(contains === false){
              this.filteredSubCategories[i].products[j].productOptions.splice(k,1);
              k--;
            }
          }
          if(this.filteredSubCategories[i].products[j].productOptions.length == 0){
            this.filteredSubCategories[i].products.splice(j,1);
            j--;
          }
        }
        if(this.filteredSubCategories[i].products.length == 0){
          this.filteredSubCategories.splice(i,1);
          i--;
        }
      }
    }
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
  minifyCategoryAll(jsonString:string){
    this.filteredSubCategories = JSON.parse(jsonString);
    let length = this.filteredSubCategories.length;
    for(let i = 0 ; i < length; i++){
      let length2 = this.filteredSubCategories[i].products.length;
      let minified = false;
      let products = 0;
      if(this.subCategoryName === "all"){
        for(let j = 0; j < length2; j++){
          products = products + this.filteredSubCategories[i].products[j].productOptions.length;
        }
        if(products < 6 && length2 > 1)
        {
          this.filteredSubCategories[i].products = this.filteredSubCategories[i].products.splice(0,2);
          this.filteredSubCategories[i].products[0].productOptions = this.filteredSubCategories[i].products[0].productOptions.splice(0,1);
          this.filteredSubCategories[i].products[1].productOptions = this.filteredSubCategories[i].products[1].productOptions.splice(0,1);
          minified = true;
        }
        else if(products >=6 && length2 > 1)
        {
          this.filteredSubCategories[i].products = this.filteredSubCategories[i].products.splice(0,2);
          this.filteredSubCategories[i].products[0].productOptions = this.filteredSubCategories[i].products[0].productOptions.splice(0,2);
          this.filteredSubCategories[i].products[1].productOptions = this.filteredSubCategories[i].products[1].productOptions.splice(0,3);
          minified = true;
        }
        else if(products > 3 && length2 === 1){
          this.filteredSubCategories[i].products[0].productOptions = this.filteredSubCategories[i].products[0].productOptions.splice(0,2);
          minified = true;
        }
      }
      this.filteredSubCategories[i].minified = minified;
      this.filteredSubCategories[i].position = i+1;
    }
    this.minifyJsonCategories = JSON.stringify(this.filteredSubCategories);
    if(this.subCategoryName != "all"){
      this.rawJsonCategories = this.minifyJsonCategories;
    }
    else{
      this.rawJsonCategories = jsonString;
    }
    this.subCategories = JSON.parse(this.rawJsonCategories);
  }
  initProductInformation(res:HttpResponse<Object>){
    this.collections = globals.collections+this.gender+"/";
    this.minifyCategoryAll(JSON.stringify(res.body));
    this.productCount(this.subCategories);
    this.initCategory(this.subCategories);
    this.initColor(this.subCategories);
    
  }
  productHandler(gender:string, subCategoryName:string){
    this.shopService.productByGenderAndSubCategory(gender,subCategoryName)
    .subscribe(res =>{
      this.setTitle(gender, subCategoryName);
      this.initProductInformation(res);
      this.load = false;
      this.changeDetector.detectChanges();
    },err=>{
      this.changeDetector.detectChanges();
      this.statusService.statusHandler(err.status);
    });
  }
  productCount(subCategories:Subcategory[]){
    this.numberOfProduct = 0;
    let length = subCategories.length;
    for(let i = 0 ; i < length; i++){
      let length2 = subCategories[i].products.length;
      for(let j = 0; j < length2; j++){
        this.numberOfProduct = this.numberOfProduct + subCategories[i].products[j].productOptions.length;
      }
    }
    if(this.originSubCategoryCount == 0){
      this.originSubCategoryCount = this.numberOfProduct;
    }
  }
  disabledBtnColor(colorKey:String,colorDisabled:boolean){
    if(colorDisabled === true){
      if(colorKey === "White" || colorKey === "Pink"){
        return "--disabled-color-white";
      }
      return "--disabled-color";
    }
    if(this.groupColors.get(colorKey).check === true){
      if(window.innerWidth < 768){
        return "filter-item-check";
      }
      return "--select-item2";
    }
    return null;
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
  ngOnInit() {
    this.carousel3.showNavigationArrows = false;
    this.carousel3.showNavigationIndicators = false;
  }
  ngAfterViewInit(){
    this.carousel.pause();
    this.carousel3.pause();
  }
}
