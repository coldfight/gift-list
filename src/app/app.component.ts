import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";

import {
  Events,
  MenuController,
  Platform,
  ToastController
} from "@ionic/angular";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Storage } from "@ionic/storage";
import { Subscription } from "rxjs";

import { UserData } from "./providers/user-data";
import { AuthType } from "./enums/auth-type.enum";
import { take } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  private _authTypeSubscription: Subscription;
  appPages = [
    {
      title: "Gift List",
      url: "/app/tabs/gifts",
      icon: "gift"
    },
    {
      title: "Recipients",
      url: "/app/tabs/recipients",
      icon: "people"
    }
  ];
  loggedIn = false;
  dark = false;

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.userData
      .autoLogin()
      .pipe(take(1))
      .subscribe();

    this.userData.isAuthenticated().subscribe(isAuthenticated => {
      return this.updateLoggedInStatus(isAuthenticated);
    });

    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: "Update available!",
        showCloseButton: true,
        position: "bottom",
        closeButtonText: `Reload`
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  ngOnDestroy() {
    if (this._authTypeSubscription) {
      this._authTypeSubscription.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    this.loggedIn = loggedIn;
  }

  listenForLoginEvents() {
    this._authTypeSubscription = this.userData.authType.subscribe(
      (authType: AuthType) => {
        switch (authType) {
          case AuthType.UserLogin:
            this.updateLoggedInStatus(true);
            break;
          case AuthType.UserSignup:
            this.updateLoggedInStatus(true);
            break;
          case AuthType.UserLogout:
            this.updateLoggedInStatus(false);
            break;
        }
      }
    );
  }

  logout() {
    this.userData.logout().subscribe(() => {
      return this.router.navigateByUrl("/login");
    });
  }
}
