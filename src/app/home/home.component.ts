import { Component, OnInit } from '@angular/core';
import { globals } from '../globals';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  private img = globals.server+"/img";
  showNavigationArrows = true;
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
  captions = [this.cap1,this.cap2,this.cap3];
  constructor(config: NgbCarouselConfig) {
  }

  ngOnInit() {
  }

}
