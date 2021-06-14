import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Friend } from '../_models/friend'
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private http: HttpClient) { }

  createRequest(friendRequest) {
    return this.http.post<Friend>(`${environment.apiUrl}friends/createrequest`, friendRequest);
  }

  updateFriendRequestById(friendRequest, friendRequestId) {
    return this.http.put(`${environment.apiUrl}friends/`+ friendRequest, friendRequestId);
  }

  getAllRequest() {
    return this.http.get<any[]>(`${environment.apiUrl}friends/`);
  }

  getFriendRequestById(requestId: string) {
    return this.http.get<Friend>(`${environment.apiUrl}friends/`+ requestId);
  }
}
