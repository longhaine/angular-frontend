import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { AddressComponent } from './address/address.component';
import { InfoComponent } from './info/info.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { SpaceToLineBreakModule } from '.././pipe/space-to-line-break.module';

@NgModule({
  declarations: [
    AddressComponent,
    InfoComponent,
    OrderInfoComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpaceToLineBreakModule
  ]
})
export class AccountModule { }
