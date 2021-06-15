import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { User } from '../_models/user';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { 
          if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
        }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });

  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login({email: this.f.email.value, password: this.f.password.value})
        .pipe(first())
        .subscribe(
            (data: User) => {
              if (!data.isActive) {
                this.alertService.error("Your account is NOT active.  Please call Sys Admin!!");
                this.loading = false;
              } else {
                this.router.navigate([this.returnUrl]);
              }
            },
            error => {
              this.alertService.error("Invalid User Id or Password, please try again!");
              this.loading = false;
            });
  }

  forgotpassword() {
    this.router.navigate(['./forgotpassword']);

  }

}
