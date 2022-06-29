import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private loaderService: LoaderService
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        const token = this.authService.getToken();
        if(token) {
            req = req.clone({
               setHeaders: {Authorization: `Bearer ${token}`}
            });
        }
        return next.handle(req).pipe(map((event: HttpEvent<any>)=>{
            // setInterval(()=>{this.loaderService.hide()}, 5000)
            this.loaderService.hide();
            if(event instanceof HttpResponse) {
                // this.loaderService.hide();
                if(event.body.status===401) {
                    localStorage.removeItem('loggedInUserId');
                    localStorage.removeItem('token');
                    this.router.navigate(['/user/session-expired']);
                }
            }
              return event;
        }));
    }
}