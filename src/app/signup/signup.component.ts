import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SignupService } from '../service/signup.service';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Input() typeOfHeader = "default";
  signUpForm:FormGroup;
  submitted:boolean = false;
  alert:string;
  constructor(
    public activeModal : NgbActiveModal,
    private formBuilder: FormBuilder,
    private signUpService:SignupService,
    private dataService: DataService) { 
      this.signUpForm = this.formBuilder.group({
        email:'',
        password:'',
        fullname:''
      });
    }
  get fSignUp(){return this.signUpForm.controls;}
  signUp(value:any){
    this.submitted = true;
    if(!this.signUpForm.invalid){
      this.signUpService.signUp(value.email, value.password, value.fullname).subscribe(res =>{
        let body = JSON.parse(JSON.stringify(res.body));
        this.dataService.setAuthorizationInfo(body);
        this.activeModal.close('success');
      },error =>{
        if(error.status === 404){
          this.alert = "The email is already in use!";
        }
      })
    }else{
      return false;
    }

  }
  ngOnInit() {

  }

}
