import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { featured, globals } from '../environtments';
import { Breadcrumb } from '../interface/breadcrumb';
import { Subcategory } from '../class/subcategory';
import {ShopService} from '../service/shop.service';
import { DataService } from '../service/data.service';
import { Intro } from '../interface/intro';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  img = globals.server+"/img";
  template:string = "";
  gender:string = "";
  navigateCheck = false;
  subCategoryName:string;
  originSubCategoryName:string; // for side nav highlight
  breadcrumbs:Breadcrumb[] = [];
  subCategories:Subcategory[] = [];
  introTemplate:Intro;
  constructor(private route:ActivatedRoute,
  private router:Router,
  private shopService:ShopService,
  private dataService:DataService) {
    this.route.paramMap.subscribe(params =>{
      scrollTo(0,0);
      this.initGender(params);
      if(this.navigateCheck === false)
      {
        this.subCategoryName = params.get("subCategoryName");
        this.resetBreadCrumb();
        this.initBreadCrumb(this.gender,this.subCategoryName);
        this.introTemplate = this.dataService.getSubcategoryByGender(this.gender, this.subCategoryName);
        this.originSubCategoryName = this.subCategoryName;
        this.subCategoryName = this.subCategoryName.toLowerCase();
        if(featured.has(this.subCategoryName)){
          this.template = "shop2";
        }
        else{
          this.template = "shop";
        }
      }
    });
  }
  initGender(params:ParamMap){
    let genderParam = params.get("gender") // avoid repeating loading Subcategories by gender
    if(genderParam === "men" || genderParam ==="women"){
      if(this.gender !== genderParam)
      {
        this.gender = genderParam;
        this.InitSideNav(this.gender);
      }
    }
    else{
      this.navigateCheck = true;
      this.router.navigate(['/404']);
    }
  }
  InitSideNav(gender:string){
    this.shopService.sideSubCategoryByGender(gender)
    .subscribe(res =>{
      this.subCategories = JSON.parse(JSON.stringify(res.body));
    }, err=>{
      this.router.navigate(['/404']);
    });
  }
  initBreadCrumb(gender:string, subCategoryName:string){
    this.breadcrumbs.push({type:"gender",name:gender,gender:gender,subCategory:'all'});
    this.breadcrumbs.push({type:"subCategory",name:subCategoryName,gender:gender,subCategory:subCategoryName});
  }
  resetBreadCrumb(){
    this.breadcrumbs = [];
  }
  scrollToElement(idName:string){
    let element:Element = document.getElementById(idName);
    if(element !== null){
      element.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  ngOnInit() {
  }
}
