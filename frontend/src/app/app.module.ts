import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TokenInterceptor } from './auth-module/interceptors/token.interceptor';
import { LayoutModule } from './layout-module/layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  bootstrap: [AppComponent],
  providers: [
      {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}  ,
      MatDatepickerModule
  ]
})
export class AppModule { }
