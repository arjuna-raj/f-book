import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../_models/post'
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  constructor(private http: HttpClient) { }

  uploadFile(formData) {
    return this.http.post<any>(environment.apiUrl + 'files/uploadfile', formData);
  }

  getFilePhotoByID(photoId: string) {
    return this.http.get(environment.apiUrl + 'files/' + photoId, { responseType: "blob"});
  }
}
