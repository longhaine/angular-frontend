import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { Handle404Component } from './handle404/handle404.component';
import { InfoComponent } from './info/info.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'collections/:gender/:subCategoryName',component:ShopComponent},
  {path:'account',children:[
    {path:'', redirectTo:'info',pathMatch:'full'},
    {path:'info', component:InfoComponent},
    {path:'orders',component:OrderInfoComponent},
    {path:'shipping',component:AddressComponent}
  ]},
  {path:'products/:link',component:ProductComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'404', component:Handle404Component},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
