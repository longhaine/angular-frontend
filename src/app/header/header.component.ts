import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { CategoryService } from '../service/category.service';
import { Category } from '../class/category';
import { Subcategory } from '../class/subcategory';
import { globals } from '../environtments';
import { HostListener } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public transparentTrigger:boolean = false;
  private img = globals.server+"/img";
  private categoriesOfWomen: Category[] = [];
  private categoriesOfMen: Category[] = [];
  content = {women:false,men:false,about:false};
  private banner:Element;
  constructor(private router: Router,
              private modalService: NgbModal,
              private categoryService: CategoryService,
              private dataSerice: DataService){
  }
  navigateToHome(){
    this.transparentTriggeringOn();
    this.router.navigate(['/']);
  }
  openLoginComponent(){
    const modalRef = this.modalService.open(LoginComponent);
  }
  openSignupComponent(){
    const modalRef = this.modalService.open(SignupComponent);
  }
  getCategory(){
    this.categoryService.getCategory().subscribe(results =>{
      // (results.body)[0] is women [1] is men
      this.categoriesOfWomen = JSON.parse(JSON.stringify((results.body)[0].categories));
      this.categoriesOfMen = JSON.parse(JSON.stringify((results.body)[1].categories));
    })
  }
  leftsOfHeaderOnHover(content:String){
    if(content ==="women")
    {
      this.content.women=true;
      this.content.men = false;
      this.content.about = false;
    }else if(content ==="men"){
      this.content.women=false;
      this.content.men = true;
      this.content.about = false;
    }else{
      this.content.women=false;
      this.content.men = false;
      this.content.about = true;
    }
  }
  headerOnHover(){
    this.unsetTransparentBanner();
  }
  headerOutHover(){
    let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
    if(scrollTop == 0 && this.transparentTrigger == true){
      this.setTransparerntBanner();
    }else{
      this.unsetTransparentBanner();
    }
  }
  transparentTriggeringOn(){
    this.transparentTrigger = true;
    this.setTransparerntBanner();
  }
  transparentTriggeringOff(){
    this.transparentTrigger = false;
    this.unsetTransparentBanner();
  }
  setTransparerntBanner(){
    this.banner.setAttribute("Style","background-color:unset");
    let headerItems : HTMLCollectionOf<Element> = this.banner.getElementsByClassName("header-item");
    headerItems.item(0).classList.remove("underline-item"); //women
    headerItems.item(1).classList.remove("underline-item"); //men
    headerItems.item(2).classList.remove("underline-item"); //about
  }
  unsetTransparentBanner(){
    this.banner.setAttribute("Style","background-color:white");
    let headerItems : HTMLCollectionOf<Element> = this.banner.getElementsByClassName("header-item");
    headerItems.item(0).classList.add("underline-item"); //women
    headerItems.item(1).classList.add("underline-item"); //men
    headerItems.item(2).classList.add("underline-item"); //about
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
    if(scrollTop == 0 && this.transparentTrigger == true){
      this.setTransparerntBanner();
    }else{
      this.unsetTransparentBanner();
    }
  }
  ngOnInit() {
    this.getCategory();
  }
  ngAfterViewInit(){
    this.banner = document.getElementById("elliana-banner");
    this.transparentTriggeringOn();
    this.dataSerice.changeMessage('ready'); //alert for another component that the header component is ready.
    /*
    if another component already received message and send back,
    the header component sets default message to dataService
    */
    this.dataSerice.headerMessageSubcriber.subscribe(message=>{
      if(message === "received"){
        this.dataSerice.changeMessage("default");
        this.transparentTriggeringOff();
      }
    })
  }
}
