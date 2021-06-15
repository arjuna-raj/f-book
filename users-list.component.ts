import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service'
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { User } from '../_models/user';
import { FileuploadService } from '../_services/fileupload.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  currentUser: User;
  allusers: User[];
  user: User;
  constructor(private userService: UserService,
    private fileuploadService: FileuploadService,
    private alertService: AlertService) {
  }

  ngOnInit() {

     // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse( localStorage.getItem('currentUser'));
  
    // Retrieve all users
    this.findAllUser();

  }

  // Method to block a User (i.e., set the isActive Indicator to false)
  blockuser(id) {

    // Create a User Object to update the User isActive property to FALSE 
    this.user = new User;
    this.user.id = id;
    this.user.isActive = false;  // Set the User isActive to FALSE (i.e., block User) 
    this.userService.updateUser(id, this.user)
      .pipe(first())
      .subscribe(
        data => {
          // Reload the Users	
          this.findAllUser();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
        });
  }

  // Method to UN-block a User (i.e., set the isActive Indicator to true)
  unblockuser(id) {

    // Create a User Object to update the User isActive property to TRUE 
    this.user = new User;
    this.user.id = id;
    this.user.isActive = true; // Set the User isActive to TRUE (i.e., UN-block User) 
    this.userService.updateUser(id, this.user)
      .pipe(first())
      .subscribe(
        data => {
          // Reload the Users	
          this.findAllUser();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
        });
  }

  // Call the service (userService) to obtain a list of all of the
  // users
  findAllUser() {

    this.userService.findAllUsers()
      .pipe(first())
      .subscribe(
        data => {
          this.allusers = data;
          // Load all profile pictures
          for (let i = 0; i < this.allusers.length; i++) {
            this.getUserPhotoImage(this.allusers[i].photoId, i)
          }

        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
        });
  }
  getUserPhotoImage(Id, i) {

    this.fileuploadService.getFilePhotoByID(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data, i);
        });
  }


  createImageFromBlob(image: Blob, i) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.allusers[i].photoImg = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
