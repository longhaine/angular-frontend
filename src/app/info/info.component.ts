import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import { InfoService } from '../service/info.service';
import { DataService } from '../service/data.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  form:FormGroup;
  submitted:boolean = false;
  alert:string;
  message:string;
  fullName:string;
  email:string;
  constructor(private formBuilder:FormBuilder,
    private infoService: InfoService,
    private dataService: DataService,
    private cookieService:CookieService) {
    this.form = this.formBuilder.group({
      fullName:'',
      email:'',
      password:''
    })
  }
  get f(){return this.form.controls;}
  updateToken(email:string, fullName:string){
    this.dataService.setEmailCookie(email);
    this.dataService.setFullNameCookie(fullName);
  }
  onSubmit(value:any){
    this.submitted = true;
    this.message = null;
    this.alert = null;
    if(this.form.valid){
      this.infoService.updateInfo(value.fullName, value.email, value.password).subscribe(res=>{
        let body = JSON.parse(JSON.stringify(res.body));
        this.form.value.email = body.email;
        this.form.value.fullName = body.fullName;
        this.updateToken(body.email,body.fullName);
        this.message = "Your information have been updated.";
      },error =>{
        if(error.status === 401){
          this.alert = "Your login session has expired!";
          // because sometimes cookie service glitches so have to delete it again
          while(this.dataService.checkCookieObject("email")){
            this.dataService.deleteAllCookies();
          }
          setTimeout(function(){
            window.location.reload();
          },3000);
        }else{
          this.alert = "There is something wrong!";
        }
        
      });
    }else{
      return false;
    }
  }
  ngOnInit() {
    if(this.cookieService.check("email")){
      this.email = this.dataService.getEmailCookie();
      this.fullName = this.dataService.getFullNameCookie();
    }
    if(!this.email){
      this.dataService.changeMessage("require login");// user hasn't login yet
    }
  }

}
