import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Route,
  UrlSegment,
  Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { UserData } from "./user-data.service";
import { take, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanLoad {
  constructor(private userData: UserData, private _router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userData.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.userData.autoLogin();
        }
        return of(isAuthenticated);
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this._router.navigateByUrl("/login");
        }
      })
    );
  }
}
