import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from '../login/login.component';
import {SignupComponent} from '../signup/signup.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: NgbModal) { }
  openLoginComponent(){
    const modalRef = this.modalService.open(LoginComponent);
  }
  openSignupComponent(){
    const modalRef = this.modalService.open(SignupComponent);
  }
  ngOnInit() {
  }

}
