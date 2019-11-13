import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["./login.scss"]
})
export class LoginPage implements OnInit {
  submitted = false;
  loading = false;
  form: FormGroup;
  serverErrors = null;

  constructor(public userData: UserData, public router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onLogin() {
    this.serverErrors = [];
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    this.userData
      .login(this.form.get("username").value, this.form.get("password").value)
      .subscribe(
        result => {
          this.loading = false;
          this.submitted = false;
          this.form.reset();
          this.router.navigateByUrl("/app/tabs/gifts");
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.serverErrors = [err.error.message];
        }
      );
  }

  onSignup() {
    this.router.navigateByUrl("/signup");
  }
}
