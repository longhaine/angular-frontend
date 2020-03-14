import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Handle404Component } from './handle404/handle404.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { CollectionComponent} from './collection/collection.component';
const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'collections/:gender/:subCategoryName',component:CollectionComponent},
  { path:'account',
  loadChildren:() => import('./account/account.module').then(m => m.AccountModule)},
  {path:'products/:link',component:ProductComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'404', component:Handle404Component},
  { path: 'reset', loadChildren: () => import('./reset/reset.module').then(m => m.ResetModule) },
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
