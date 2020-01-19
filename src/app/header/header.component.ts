import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { CategoryService } from '../service/category.service';
import { Category } from '../class/category';
import { Subcategory } from '../class/subcategory';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private categoriesOfWomen: Category[] = [];
  private categoriesOfMen: Category[] = [];
  content = {women:true,men:false,about:false};
  constructor(private modalService: NgbModal,
              private categoryService: CategoryService) { }
  openLoginComponent(){
    const modalRef = this.modalService.open(LoginComponent);
  }
  openSignupComponent(){
    const modalRef = this.modalService.open(SignupComponent);
  }
  getCategory(){
    this.categoryService.getCategory().subscribe(results =>{
      // (results.body)[0] is women
      this.categoriesOfWomen = JSON.parse(JSON.stringify((results.body)[0].categories));
      this.categoriesOfMen = JSON.parse(JSON.stringify((results.body)[1].categories));
      console.log(this.categoriesOfWomen);
      console.log(this.categoriesOfMen);
    })
  }
  bannerHover(content:String){
    console.log(content);
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
  ngOnInit() {
    this.getCategory();
  }

}
