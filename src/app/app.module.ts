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
    SpaceToLineBreakPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [HeaderComponent],
  bootstrap: [AppComponent],
  entryComponents:[LoginComponent,SignupComponent]
})
export class AppModule { }
