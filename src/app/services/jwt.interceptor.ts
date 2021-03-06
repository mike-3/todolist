import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUserToken = localStorage.getItem('user-jwt-token');
        if (currentUserToken) {
            request = request.clone({
               setHeaders: {
                   Authorization: `bearer ${currentUserToken}`
               }
            });
        }

        return next.handle(request)
          .pipe(
            tap(event => {},
              (err: any) => {
                if (err instanceof HttpErrorResponse) {
                  if (err.status === 401) {
                    this.authService.logout();
                  }
                }
              })
          );
    }
}
