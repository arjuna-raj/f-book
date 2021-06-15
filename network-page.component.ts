import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service'
import { AlertService } from '../_services/alert.service'
import { FriendsService } from '../_services/friends.service';
import { Friend } from '../_models/friend';
import { FileuploadService } from '../_services/fileupload.service';

import { SharedComponent } from '../shared/shared.component';

@Component({
  selector: 'app-network-page',
  templateUrl: './network-page.component.html',
  styleUrls: ['./network-page.component.css']
})
export class NetworkPageComponent implements OnInit {
  
  @ViewChild(SharedComponent, { static: false }) sharedComponent: SharedComponent;
  friends: Friend[] = [];
  friendsrequest: Friend[] = [];
  users: User[] = [];
  currentUser: User;
  networkForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private userService: UserService,
    private friendsService: FriendsService,
    private filesService: FileuploadService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.alertService.clear();

    this.getAllNetworkUsers();

  }

  sendrequestuser(id) {

    this.alertService.clear;

    var friendRequest = {
      'userId': JSON.parse(localStorage.getItem('currentUser'))._id,
      'friendId': id,
      'status': "Request Pending"
    };
    this.friendsService.createRequest(friendRequest).pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Friend request sent successfully");
          this.getAllNetworkUsers();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });


  }

  acceptfriendRequest(id, friendrequestId) {

    this.alertService.clear;

    var friendRequest = {
      'userId': id,
      'friendId': JSON.parse(localStorage.getItem('currentUser'))._id,
      'status': "You are friend"
    };
    this.friendsService.updateFriendRequestById(friendRequest, friendrequestId).pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Friend added successfully");
          this.getAllNetworkUsers();

          this.sharedComponent.getFriendsCount();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });


  }

  getAllNetworkUsers() {
    this.userService.findAllUsers()
      .pipe(first())
      .subscribe(
        data => {
          this.users = data;
          this.getfriendsrequests();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });
  }

  getfriendsrequests() {
    this.friendsService.getAllRequest()
      .pipe(first())
      .subscribe(
        data => {
          this.friendsrequest = data;
          this.UpdateStatus();

          for (let i = 0; i < this.users.length; i++) {
            this.getUserPhotoImage(this.users[i].photoId, i)
          }
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });

  }

  UpdateStatus() {
    for (var i = 0; i < this.users.length; i++) { 
      this.users[i].status = "Send Request";

      for (var j = 0; j < this.friendsrequest.length; j++) {  

        if (((this.users[i].id == this.friendsrequest[j].userId) &&
          (this.currentUser._id == this.friendsrequest[j].friendId)) ||
          ((this.users[i].id == this.friendsrequest[j].friendId) &&
            (this.currentUser._id == this.friendsrequest[j].userId))) {

          this.users[i].status = this.friendsrequest[j].status;
          this.users[i].friendrequestId = this.friendsrequest[j]._id;

          if ((this.currentUser._id == this.friendsrequest[j].friendId) &&
            (this.friendsrequest[j].status == "Request Pending")) {
            this.users[i].status = "Accept Friend Request"
          }

        }

      }

    }
  }
  getUserPhotoImage(Id, i) {

    this.filesService.getFilePhotoByID(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data, i);
        });
  }


  createImageFromBlob(image: Blob, i) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.users[i].photoImg = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
