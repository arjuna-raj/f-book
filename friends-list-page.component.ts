
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { FriendsService } from '../_services/friends.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { Friend } from '../_models/friend';
import { User } from '../_models/user';
import { FileuploadService } from '../_services/fileupload.service';

@Component({
  selector: 'app-friends-list-page',
  templateUrl: './friends-list-page.component.html',
  styleUrls: ['./friends-list-page.component.css']
})
export class FriendsListPageComponent implements OnInit {
  potentialfriends: Friend[];
  friends: Friend[] = new Array();
  submitted = false;
  currentUser: User;

  constructor( private userService: UserService,
    private friendsService: FriendsService,
    private filesService: FileuploadService,
    private alertService: AlertService) {

  }

  ngOnInit() { 
      this.currentUser = JSON.parse( localStorage.getItem('currentUser'));
    
      this.friendsService.getAllRequest()
        .pipe(first())
        .subscribe(
          data => {
  
            this.potentialfriends = data;
            this.friends = new Array;
  
            for (let i = 0; i < this.potentialfriends.length; i++) {
              if ((this.currentUser._id == this.potentialfriends[i].userId ||
                this.currentUser._id == this.potentialfriends[i].friendId) &&
                (this.potentialfriends[i].status == "You are friend")) {
  
                if (this.currentUser._id != this.potentialfriends[i].userId) {
                  this.finduserNameAndPhotoId(this.potentialfriends[i].userId, i);
                }
  
                if (this.currentUser._id != this.potentialfriends[i].friendId) {
                  this.finduserNameAndPhotoId(this.potentialfriends[i].friendId, i);
                }
  
                this.friends.push(this.potentialfriends[i]);
  
              }
  
            }
  
          },
          error => {
            this.alertService.error("Error retrieving Data. Please re-login and try again!");
  
          });
    }
  
    finduserNameAndPhotoId(friendId, i) {
      this.userService.findUserID(friendId)
  
        .subscribe((data: User) => {
  
          this.potentialfriends[i].friendName = data.lastName + ", " + data.firstName;
          this.potentialfriends[i].photoId = data.photoId;
          this.getUserPhotoImage(this.potentialfriends[i].photoId, i)
        },
          error => {
            this.alertService.error("Unable to find a User");
  
          });
    }
  
  
    getUserPhotoImage(Id, i) {
  
      this.filesService.getFilePhotoByID(Id)
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.createImageFromBlob(data, i);
          },
          error => {
            this.alertService.error("Error retrieving Data. ");
  
          });
    }
  
  
    createImageFromBlob(image: Blob, i) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.potentialfriends[i].photoImg = reader.result;
      }, false);
  
      if (image) {
        reader.readAsDataURL(image);
      }
    }
}
