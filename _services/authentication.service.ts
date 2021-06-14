import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import {environment} from '../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public founduser: User;

    constructor(private http: HttpClient, private datePipe: DatePipe) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login({ email, password }: { email; password; }) {

        return this.http.post<any>(`${environment.apiUrl}users/authenticate`, { email, password })
            .pipe(map((user: User) => {

                if (!user.isActive) {
                    return new User;
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
 
                var cUser : User = JSON.parse(localStorage.getItem('currentUser'));
                cUser.dob = this.datePipe.transform(cUser.dob, 'dd/MM/yyyy');
                localStorage.setItem('currentUser', JSON.stringify(cUser));

                return cUser;
            }));
    }

    finduserbyemail(email: String) {

		let promise = new Promise((resolve, reject) => {
			this.http.post<any>(`${environment.apiUrl}users/finduserbyemail`
			, { email: email }).toPromise().then(
				  (res: User[]) => { 
                    this.founduser = res[0];
					resolve(res);
				  },
				  msg => { 
					reject(msg);
				  }
			  );
		});
		return promise;
	}

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}