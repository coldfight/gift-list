import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Subject, from, Observable, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { take, tap, switchMap, map } from "rxjs/operators";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { AuthType } from "../enums/auth-type.enum";
import { User } from "../interfaces/user.interface";

@Injectable({
  providedIn: "root"
})
export class UserData {
  _favorites: string[] = [];

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get user(): Observable<User> {
    return this._user.asObservable();
  }

  private _authType: Subject<AuthType> = new Subject();
  get authType(): Observable<AuthType> {
    return this._authType.asObservable();
  }

  constructor(public storage: Storage, private _http: HttpClient) {}

  hasFavorite(sessionName: string): boolean {
    return this._favorites.indexOf(sessionName) > -1;
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(username: string, password: string) {
    return this._http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, {
        username,
        password,
        refresh: true
      })
      .pipe(
        take(1),
        switchMap((authResponse: AuthResponse) => {
          // @todo: Figure out secure storage.
          return from(
            this.setUserData({
              loggedIn: true,
              jwtToken: authResponse.token,
              refreshToken: authResponse.refreshToken,
              username
            })
          );
        }),
        tap(() => {
          return this._authType.next(AuthType.UserLogin);
        })
      );
  }

  signup(username: string, password: string) {
    return this._http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/signup`, {
        username,
        password,
        refresh: true
      })
      .pipe(
        take(1),
        switchMap((authResponse: AuthResponse) => {
          // @todo: Figure out secure storage.
          return from(
            this.setUserData({
              loggedIn: true,
              jwtToken: authResponse.token,
              refreshToken: authResponse.refreshToken,
              username
            })
          );
        }),
        tap(() => {
          return this._authType.next(AuthType.UserSignup);
        })
      );
  }

  refreshToken() {
    let loadedUser;
    return this.user.pipe(
      take(1),
      switchMap((user: User) => {
        loadedUser = user;
        return this._http.post<AuthResponse>(
          `${environment.apiUrl}/api/auth/token`,
          {
            username: user.username,
            refreshToken: user.refreshToken
          }
        );
      }),
      take(1),
      switchMap((response: AuthResponse) => {
        loadedUser = { ...loadedUser, jwtToken: response.token };
        return this.setUserData(loadedUser);
      }),
      tap(r => {
        this._user.next(loadedUser);
      })
    );
  }

  logout() {
    // @todo: I might want to clear my refresh token in the API
    return this.removeUserData().pipe(
      take(1),
      tap(() => {
        this._authType.next(AuthType.UserLogout);
      })
    );
  }

  setUserData(user: User) {
    return this.storage.set("userData", user);
  }
  removeUserData(): Observable<any> {
    return from(this.storage.remove("userData"));
  }

  setUsername(username: string): Promise<any> {
    return this.storage.get("userData").then((user: User) => {
      if (!user) {
        return null;
      }
      user.username = username;
      return this.storage.set("userData", user);
    });
  }

  getUsername(): Promise<string> {
    return this.storage.get("userData").then((user: User) => {
      return user ? user.username : null;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get("userData").then((user: User) => {
      return user ? user.loggedIn : false;
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(
      map(user => {
        if (user) {
          return !!user.jwtToken;
        }
        return false;
      })
    );
  }

  autoLogin() {
    return from(this.storage.get("userData")).pipe(
      tap((user: User) => {
        if (user) {
          this._user.next(user);
        }
      }),
      map((user: User) => {
        return !!user;
      })
    );
  }
}
