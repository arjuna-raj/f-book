import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models/user';
import { Post } from '../_models/post';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

createPost(post: User) {
  return this.http.post<Post>(`${environment.apiUrl}posts/createpost`, post);
}

getPostsByUserId(id ){
  return this.http.post<Post[]>(`${environment.apiUrl}posts/findpostbyuserid`, {"id" : id});
}

getAllPost() {
  return this.http.get<Post[]>(`${environment.apiUrl}posts/`);
}

findPostByUserId(userId: User) {
  return this.http.post<Post>(`${environment.apiUrl}posts/createpost`, {id: userId});
}

updateBulkPosts(updatePayload) {
  return this.http.post<Post>(`${environment.apiUrl}posts/updatemanyposts`, updatePayload);
}

updatePost(updatedPost) {
  return this.http.put<Post>(`${environment.apiUrl}posts/`, updatedPost.id, updatedPost);
}

deletePost(id: number) {
  return this.http.delete<Post>(`${environment.apiUrl}posts/${id}`);
}
}
