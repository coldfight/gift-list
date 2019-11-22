import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { tap, take, switchMap, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserData } from "../services/user-data.service";
import { User } from "../interfaces/user.interface";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _userData: UserData,
    private _http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._userData.user.pipe(
      take(1),
      switchMap((user: User) => {
        if (user) {
          request = request.clone({
            setHeaders: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.jwtToken}`
            }
          });
        }
        return next.handle(request);
      }),
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (
          (["POST"].indexOf(request.method) >= 0 &&
            request.url.includes("/auth/token")) ||
          request.url.includes("/login")
        ) {
          if (request.url.includes("/auth/token")) {
            this._userData.logout().subscribe(() => {
              this._router.navigateByUrl("/login");
            });
          }
          return throwError(error);
        } else if (
          ["DELETE"].indexOf(request.method) >= 0 &&
          request.url.includes("/auth/token")
        ) {
          this._userData.logout(false).subscribe(() => {
            console.log("HERE");
            this._router.navigateByUrl("/login");
          });
          return throwError(error);
        }

        if (error.status !== 401) {
          return throwError(error);
        }

        // @todo: Check if we're using refresh token before trying to refresh our access token. otherwise log out...
        return this._userData.refreshToken().pipe(
          take(1),
          switchMap((user: User) => {
            request = request.clone({
              setHeaders: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.jwtToken}`
              }
            });
            return next.handle(request);
          }),
          catchError((err: HttpErrorResponse) => {
            this._userData.logout().subscribe(() => {
              this._router.navigateByUrl("/login");
            });
            return throwError(err);
          })
        );
      })
    );
  }
}
