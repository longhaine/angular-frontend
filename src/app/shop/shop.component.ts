import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
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
              private tokenService: TokenService) { }
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
  private numberOfProduct:number = 0;
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
  initProductInformation(res:HttpResponse<Object>){
    this.products = JSON.parse(JSON.stringify(res.body));
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
      this.dataService.changeMessage("update carts");
      this.dataService.changeMessage("cart loading");
    })
  }
  ngAfterViewInit(){
    this.triggerHeaderComponent("off");
    
  }
  ngOnDestroy(){
    this.headerSubscription.unsubscribe();
  }
}
