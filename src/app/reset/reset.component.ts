import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import { Title }  from '@angular/platform-browser';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  emailForm:FormGroup;
  submitted:boolean = false;
  content:string;
  message:boolean = false;
  email:string;
  constructor(private route:ActivatedRoute,
  private router:Router,
  private title:Title,
  private dataService:DataService,
  private formBuilder:FormBuilder) {
    if(this.dataService.getEmailCookie().length === 0){
      this.emailForm = this.formBuilder.group({
        email:''
      });
      this.route.paramMap.subscribe(params =>{
        this.title.setTitle("Reset Password | Everlane");
        let resetId = params.get("resetId");
        if(resetId === null){
          this.content = "sendResetLink";
        }
        else{
          this.content = "setNewPassword";
        }
      });
    }
    else{
      router.navigate(['/home']);
    }
  }
  get fEmail(){return this.emailForm.controls;}
  sendResetLink(value:any){
    this.submitted = true;
    if(this.emailForm.valid){
      this.email = value.email;
      this.message = true;
    }
    else{
      return false;
    }
  }
  ngOnInit() {
  }

}
