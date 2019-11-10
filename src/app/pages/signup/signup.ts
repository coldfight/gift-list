import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
  styleUrls: ["./signup.scss"]
})
export class SignupPage implements OnInit {
  submitted = false;
  loading = false;
  form: FormGroup;
  serverErrors = null;

  constructor(public router: Router, public userData: UserData) {}

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

  onSignup() {
    this.serverErrors = [];
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    this.userData
      .signup(this.form.get("username").value, this.form.get("password").value)
      .subscribe(
        result => {
          this.router.navigateByUrl("/app/tabs/gifts");
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.error.data) {
            this.serverErrors = err.error.data.map(e => e.msg);
          }
        }
      );
  }
}
