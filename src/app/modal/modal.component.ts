import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() component;
  signUpTypeOfHeader = "default";
  constructor(private activeModal:NgbActiveModal) { }

  setComponent(component:string){
    this.component = component;
    this.signUpTypeOfHeader = "transfer";
  }
  ngOnInit() {
  }

}
