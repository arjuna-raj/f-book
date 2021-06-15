import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { PostService } from '../_services/post.service';
import { FileuploadService } from '../_services/fileupload.service';
import { FriendsService } from '../_services/friends.service';
import { Post } from '../_models/post';
import { Friend } from '../_models/friend';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  currentUser: User;
  updateUser: User;
  fbookcommonForm: FormGroup;
  newpost: Post;
  posts = [];
  posttext: string;
  myposts: Post[];
  myfriends: Friend[];
  potentialfriends: Friend[];
  selectedFile: File;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private friendsService: FriendsService,
    private fileuploadService: FileuploadService,
    private userService: UserService,
    private postService: PostService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.photoId) {
      this.getUserPhotoImage(this.currentUser.photoId);
    }

    this.getPostsCount();

    this.getFriendsCount();
  }

  public getFriendsCount() {
    this.friendsService
      .getAllRequest()
      .pipe(first())
      .subscribe(
        (data) => {
          this.potentialfriends = data;
          this.myfriends = new Array();

          for (let i = 0; i < this.potentialfriends.length; i++) {
            if (
              (this.currentUser._id == this.potentialfriends[i].userId ||
                this.currentUser._id == this.potentialfriends[i].friendId) &&
              this.potentialfriends[i].status == 'You are friend'
            ) {
              this.myfriends.push(this.potentialfriends[i]);
            }
          }
        },
        (error) => {
          this.alertService.error(
            'Error retrieving Data. Please re-login and try again!'
          );
        }
      );
  }

  getPostsCount() {
    this.postService
      .getPostsByUserId(this.currentUser._id)
      .pipe(first())
      .subscribe(
        (data: Post[]) => {
          this.myposts = data;
        },
        (error) => {
          this.alertService.error(
            'Error retrieving Data. Please re-login and try again!'
          );
        }
      );
  }

  getUserPhotoImage(Id) {
    this.fileuploadService
      .getFilePhotoByID(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data);
        },
        (error) => {
          this.alertService.error('Error retrieving Data. ');
        }
      );
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.currentUser.photoImg = reader.result;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onNewPhoto(event) {
    this.selectedFile = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('picture', this.selectedFile, this.selectedFile.name);
    this.fileuploadService
      .uploadFile(uploadData)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.getUserPhotoImage(data.uploadId);
          this.currentUser.photoId = data.uploadId;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

          this.updateUserPhotoId(data.uploadId);

          this.alertService.success('Your new Photo Image has been changed.');
        },
        (error) => {
          this.alertService.error('Error retrieving Data. ');
        }
      );
  }

  updateUserPhotoId(id) {
    this.updateUser = new User();
    this.updateUser.id = this.currentUser._id;
    this.updateUser.photoId = id;

    this.userService
      .updateUser(this.currentUser._id, this.updateUser)
      .pipe(first())
      .subscribe(
        (data: any) => {},
        (error) => {
          this.alertService.error('Error Updatmin Data. ');
        }
      );
  }
}
