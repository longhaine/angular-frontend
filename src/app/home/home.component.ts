import { Component, OnInit } from '@angular/core';
import { globals } from '../environtments';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  img = globals.server+"/img";  
  showNavigationArrows = true;
  transition:boolean = false;
  //carousel init
  cap1 = "\"Sleek, comfortable and I feel so powerful in them.\"";
  cap2 = "\"Really love the cut. Perfect length. Good amount of strecth.\"";
  cap3 = "\"I'm in love with this amazing sweater. Super soft, warm and stylish.\"";
  img1 = this.img+"/home/carousel-section1.jpg";
  img2 = this.img+"/home/carousel-section2.jpg";
  img3 = this.img+"/home/carousel-section3.jpg";
  carousels:{image: string, caption: string, by:string}[] = [
    {"image": this.img1, "caption":this.cap1,"by":"Cara"},
    {"image": this.img2, "caption":this.cap2,"by":"KT C"},
    {"image": this.img3, "caption":this.cap3,"by":"Sue"}
  ]

  //carousel animation
  carouselAnimation:Element;// carousel section trigger Animation
  caroulselSection:Element; // the whole section of carousel
  carouselPrevBtn:Element; //pre button
  carouselNextBtn:Element; // next button
  

  constructor(config: NgbCarouselConfig,
              private title: Title) {
  }
  carouselOnInit(){
    this.caroulselSection = document.getElementById("carousel");
    let carouselBtns:HTMLCollectionOf<Element> = this.caroulselSection.getElementsByTagName("a");
    for(var i = 0; i < carouselBtns.length; i++){
      if(carouselBtns.item(i).classList.contains("carousel-control-prev")){
        this.carouselPrevBtn = carouselBtns.item(i);
      }else if(carouselBtns.item(i).classList.contains("carousel-control-next")){
        this.carouselNextBtn = carouselBtns.item(i);
      }
    }
    if(this.carouselPrevBtn && this.carouselNextBtn){
      this.carouselPrevBtn.addEventListener('click',this.carouselAnimationOnClick.bind(this));
      this.carouselNextBtn.addEventListener('click',this.carouselAnimationOnClick.bind(this));
    }
  }
  carouselAnimationOnClick(){
      this.caroulselSection.setAttribute("style","opacity:0.8");
      setTimeout(() => {
      this.caroulselSection.setAttribute("style","opacity:1");
      this.transition = false;  
      }, 300);
  }
  ngOnInit() {
    this.title.setTitle("Elliana | Mordern Basics");
  }
  ngAfterViewInit(){
    this.carouselOnInit();
  }
}
