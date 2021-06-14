import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NetworkPageComponent } from './network-page/network-page.component';
import { FriendsListPageComponent } from './friends-list-page/friends-list-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { UsersListComponent } from './users-list/users-list.component';


import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component';
import { DatePipe } from '@angular/common';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AdminComponent } from './admin/admin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedComponent } from './shared/shared.component';
import { ChangePasswordComponent } from './change-password/change-password.component'


@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    LoginPageComponent,
    ForgotPasswordPageComponent,
    HomePageComponent,
    NetworkPageComponent,
    FriendsListPageComponent,
    SettingsPageComponent,
    UsersListComponent,
    AlertComponent,
    AdminComponent,
    ResetPasswordComponent,
    SharedComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
