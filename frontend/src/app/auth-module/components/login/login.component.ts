import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
// import { LoggedInUserService } from '../../services/loggedInUser.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @ViewChild('loginForm') loginForm!: NgForm; 
    authModel: AuthModel= {};
    // roles: any = [];

    constructor(
        private authService: AuthService,
        private router: Router,
        public loaderService: LoaderService
    ) {}

    ngOnInit() {
        this.alreadyLoggedIn();
        // this.roles = this.authService.getRoles();
    }

    alreadyLoggedIn() {
        if(this.authService.userIdExists()) {
            //we can't just stop at checking if userId exists in localstorage. We have to confirm first if such a user exists. Somebody might
            //set _id in localstorage manually
            this.authService.getLoggedInUserById().subscribe((res: any)=>{
                if(res.status===200) {
                    this.navigate(res.data.roleId);
                }
                else {
                    localStorage.removeItem('loggedInUserId');
                    localStorage.removeItem('token');
                    Swal.fire({
                    toast: true,
                    position: 'top',
                    title: res.data,
                    showConfirmButton: false,
                    icon: res.status===200?'success':'error',
                    timer: 3000
            });
                }
            });
        }
    }

    onLogin() {
      if(this.loginForm.valid) {
        this.authService.login(this.authModel).subscribe((res: any)=>{ //res.data is an object having mssg and data as keys. data is user object
            let mssg = res.data.mssg? res.data.mssg : 'user authenticated';
            if(res.status===200) {
                localStorage.setItem('loggedInUserId', res.data._id);
                this.authService.setToken(res.token);
                this.navigate(res.data.roleId);
            }
            Swal.fire({
                toast: true,
                position: 'top',
                title: mssg,
                showConfirmButton: false,
                icon: res.status===200?'success':'error',
                timer: 3000
            });
        });
      }
    }

    navigate(roleId: number) {
        let action;
        if (roleId===1) {
            action = "/admin/dashboard";
        } else if (roleId===2) {
            action = "/course/courses";
        } else {
            action = "/student/courses";
        }
        this.router.navigate([action]);
    }
}