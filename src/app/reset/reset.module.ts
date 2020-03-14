import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { ResetRoutingModule } from './reset-routing.module';
import { ResetComponent } from './reset.component';


@NgModule({
  declarations: [ResetComponent],
  imports: [
    CommonModule,
    ResetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ResetModule { }
