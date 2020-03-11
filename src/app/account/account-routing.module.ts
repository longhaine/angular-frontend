import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressComponent } from './address/address.component';
import { InfoComponent } from './info/info.component';
import { OrderInfoComponent } from './order-info/order-info.component';

const routes: Routes = [
  { path: '', redirectTo:'/info',pathMatch: 'full' },
  { path: 'info', component: InfoComponent },
  { path: 'orders', component: OrderInfoComponent },
  { path: 'shipping', component: AddressComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
