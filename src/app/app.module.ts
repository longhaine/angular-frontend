import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule} from '@angular/common/http';
import { ShopComponent } from './shop/shop.component';
import { Handle404Component } from './handle404/handle404.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SpaceToLineBreakPipe } from './pipe/space-to-line-break.pipe';
import { ModalComponent } from './modal/modal.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import {CookieService} from 'ngx-cookie-service';
import { InfoComponent } from './info/info.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { ColorPipe } from './pipe/color.pipe';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ShopComponent,
    Handle404Component,
    BreadcrumbComponent,
    SpaceToLineBreakPipe,
    ModalComponent,
    InfoComponent,
    OrderInfoComponent,
    AddressComponent,
    CheckoutComponent,
    ProductComponent,
    ColorPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HeaderComponent,CookieService],
  bootstrap: [AppComponent],
  entryComponents:[ModalComponent]
})
export class AppModule { }
