import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  currentUser: User;
  SettingsPageForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private alertService: AlertService) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));}


  ngOnInit() {
    this.SettingsPageForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

    get f(){ return this.SettingsPageForm.controls; }

    onSubmit() {
      this.submitted = true;
      this.alertService.clear();
      if (this.SettingsPageForm.invalid) {
        return;
      }
  
      this.alertService.clear();
  
      this.loading = true;
  
      this.userService.updateUser(this.currentUser._id, this.SettingsPageForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.success('Your changes have been saved. ', true);
            this.loading = false;
            //this.router.navigate(['/login']);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
  }

