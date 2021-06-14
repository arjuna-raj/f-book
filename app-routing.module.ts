import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NetworkPageComponent } from './network-page/network-page.component';
import { FriendsListPageComponent } from './friends-list-page/friends-list-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AuthGuard } from './_helpers/auth.guard';


const ROUTES: Routes =[
  {path:'register', component: RegistrationPageComponent},
  {path:'login', component: LoginPageComponent},
  {path:'forgot', component: ForgotPasswordPageComponent},
  {path:'', component: HomePageComponent, canActivate: [AuthGuard] },
  {path:'network', component: NetworkPageComponent},
  {path:'friends', component: FriendsListPageComponent},
  {path:'settings', component: SettingsPageComponent},
  {path:'userlist', component: UsersListComponent},
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
