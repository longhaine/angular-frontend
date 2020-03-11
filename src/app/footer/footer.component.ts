import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor() { }
  openDropdown(target:Element){
    let parentTarget = target.parentElement;
    let status = target.children.item(1);
    if(target.classList.contains("mobile-footer__item--active")){
      target.classList.remove("mobile-footer__item--active");
      status.textContent = "+";
      parentTarget.children.item(1).classList.remove("mobile-footer__sub-item--active");
    }
    else{
      status.textContent = "-";
      target.classList.add("mobile-footer__item--active");
      parentTarget.children.item(1).classList.add("mobile-footer__sub-item--active");
    }
  }
  ngOnInit() {
  }
}
