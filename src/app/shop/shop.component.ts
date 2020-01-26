import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { DataService } from '../service/data.service';
import { globals } from '../globals';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../service/shop.service';
import { StatusService } from '../service/status.service';
import { Product } from '../class/product';
import { Subcategory } from '../class/subcategory';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  constructor(private headerComponent:HeaderComponent,
              private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private shopService: ShopService,
              private statusService: StatusService) { }
  private load:boolean = false;
  private img = globals.server+"/img";
  private filterDropdown:boolean = false;
  private gender:string;
  private subCategoryName:string;
  private subCategories: Subcategory[] = [];
  private products: Product[] = [];
  private numberOfProduct:number = 0;
  ngOnInit() {
    this.routeHandler();
  }
  routeHandler(){
    this.route.paramMap.subscribe(params =>{
      this.gender = params.get("gender");
      this.subCategoryName = params.get("subCategoryName");
      if(this.gender === "men" || this.gender === "women"){
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
      console.log(this.subCategories);
    }, err=>{
      this.statusService.statusHandler(err.status);
    })
  }

  productHandler(gender:string, subCategoryName:string){
    this.shopService.productByGenderAndSubCategory(gender,subCategoryName)
    .subscribe(res =>{
      this.products = JSON.parse(JSON.stringify(res.body));
      this.addUpProducts(this.products);
      this.load = true;
    },err=>{
      this.load = false;
      this.statusService.statusHandler(err.status);
    })
  }

  addUpProducts(products:Product[]){
    products.forEach((product:Product)=>{
      this.numberOfProduct = this.numberOfProduct + product.productOptions.length;
    });
  }
  triggerHeaderComponent(){
    this.dataService.headerMessageSubcriber.subscribe(message =>{
      if(message === "ready"){
        console.log("received");
        this.dataService.changeMessage("received");
      }
    })
  }
  ngAfterViewInit(){
    this.triggerHeaderComponent();
  }
}
