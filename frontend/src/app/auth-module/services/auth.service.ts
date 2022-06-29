import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { AuthModel } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    serverUrl = environment.serverUrl;
    roles = [
        {
            roleId: 1,
            roleName: 'Admin'
        },
        {
            roleId: 2,
            roleName: 'Staff'
        },
        {
            roleId: 3,
            roleName: 'Student'
        }
    ];

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getRoles() {
        return this.roles.slice();
    }

    login(authModel: AuthModel) {
        return this.http.post(`${this.serverUrl}user/login`, authModel);
    }

    registerUser(userRegisterModel: User, editMode: boolean) {
        if(editMode) {
            return this.http.put(`${this.serverUrl}user/${userRegisterModel._id}/update-user`, userRegisterModel);
        } else {
            return this.http.post(`${this.serverUrl}user/register-user`, userRegisterModel);
        }
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    getToken() : string|null {
        return localStorage.getItem('token');
    }

    getLoggedInUserById() {
        const userId = localStorage.getItem('loggedInUserId');
        return this.http.get(`${this.serverUrl}user/${userId}/get-user`);
    }

    logout() {
        localStorage.removeItem('loggedInUserId');
        this.removeToken();
        this.router.navigate(['/user']);
    }

    changePassword(passwords: {oldPass?: string, newPass?: string}) : any{
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        return this.http.put(`${this.serverUrl}user/${loggedInUserId}/change-password`, passwords);
    }

    userIdExists() {
        const userId = localStorage.getItem('loggedInUserId');
        if(userId) {
            return true;
        }
        else {
            this.logout();
            return false;
        }
    }
}