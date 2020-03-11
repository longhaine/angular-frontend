import { Component, OnInit, Input, Output, EventEmitter, SystemJsNgModuleLoader } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from '../service/login.service';
import { DataService } from '../service/data.service'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailForm:FormGroup;
  loginForm:FormGroup;
  submitted:boolean = false;
  alert:String;
  user:string;
  email:string;
  @Output() component: EventEmitter<any> = new EventEmitter<any>();
  formContent:String ="email";
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private loginService:LoginService,
    private dataService:DataService){ 
    this.emailForm = this.formBuilder.group({
    email:''
    });
    this.loginForm = this.formBuilder.group({
    email:'',
    password:''
    });
  }
  get fEmail(){return this.emailForm.controls;}
  findEmail(value:any){
    this.submitted = true;
    if(!this.emailForm.invalid){
      this.loginService.findEmail(value.email).subscribe(res =>{
        let message = (JSON.parse(JSON.stringify(res.body))).message;
        // "yes" mean email already in used
        if(message === "yes"){
          this.submitted = false;
          this.formContent="login"
        }
        else{
          this.component.emit("signup");
        }
      });
    }
    else{
      return;
    }
  }
  get fLogin(){return this.loginForm.controls;}

  login(value:any){
    this.submitted = true;
    if(!this.loginForm.invalid){
      this.loginService.login(value.email,value.password).subscribe(res=>{
        let body = JSON.parse(JSON.stringify(res.body));
        let message = "user login";
        this.dataService.setAuthorizationInfo(body,message);
        this.activeModal.close('success'); // send to header component
      },error=>{
        if(error.status === 401){
          this.alert = "Your email or password is invalid";
        }
      });
    }
    else{
      return false;
    }
  }
  ngOnInit() {
    this.dataService.deleteAllCookies();
  }

}
