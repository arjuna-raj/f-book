import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user'
import {environment} from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post<User>(`${environment.apiUrl}users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}users`);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    findAllUsers(){
        return this.http.get<User[]>(`${environment.apiUrl}users`);
    }

    findUserID(userId: string){
        return this.http.get(`${environment.apiUrl}users/${userId}`);
    }

    findUserEmail(email: string){
        return this.http.get(`${environment.apiUrl}users/finduserbyemail${email}`);
    }

    updateUserPhoto(updatedUser){
        return this.http.post(`${environment.apiUrl}users/updateuserphotoId`, updatedUser);
    }

    updateUser(id: string, updatedUserRequest){
        return this.http.put(`${environment.apiUrl}users/updateuserphotoId`+ id, updatedUserRequest);
    }



 
}