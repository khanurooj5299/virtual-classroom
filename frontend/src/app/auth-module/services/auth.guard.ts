import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from "@angular/router";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { JwtHelperService } from "@auth0/angular-jwt";

import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivateChild{
    jwtHelper = new JwtHelperService();
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const token = this.authService.getToken();
        if(!token) {
            this.router.navigate(['/user']);
            Swal.fire({
                toast: true,
                position: 'top',
                timer: 3000,
                showConfirmButton: false,
                icon: 'error',
                title: 'You must Login first!'
            });
            return false;
        }
        else if(this.jwtHelper.isTokenExpired(token)) {
            localStorage.removeItem('loggedInUserId');
            localStorage.removeItem('token');
            this.router.navigate(['/user/session-expired']);
            return false;
        }
        return true;
    }
}