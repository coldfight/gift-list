import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { RecipientService } from "../../services/recipient.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "recipient-new",
  templateUrl: "./recipient-new.page.html",
  styleUrls: ["./recipient-new.page.scss"]
})
export class RecipientNewPage implements OnInit {
  form: FormGroup;
  errors: { [key: string]: string } = {};
  loading = false;

  constructor(
    public formBuilder: FormBuilder,
    private _navController: NavController,
    private _recipientService: RecipientService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      spendLimit: new FormControl("", Validators.compose([Validators.min(0)]))
    });
  }

  onSubmit() {
    this.errors = {};
    this.loading = true;
    if (this.form.invalid) {
      for (const key in this.form.value) {
        if (this.form.value.hasOwnProperty(key)) {
          if (this.form.get(key).invalid) {
            if (this.form.get(key).errors["required"]) {
              this.errors[key] = "This field is required.";
            } else {
              this.errors[key] = "Fix this field.";
            }
          }
        }
      }
      this.loading = false;
      return;
    }

    // once we submit this form, we might need to redirect back to the gift page
    this._recipientService
      .addRecipient(this.form.value["name"], this.form.value["spendLimit"])
      .subscribe(
        () => {
          this.loading = false;
          this.form.reset();
          this._navController.pop();
        },
        (err: HttpErrorResponse) => {
          if (err && err.error && err.error.data) {
            for (const e of err.error.data) {
              this.errors[e.param] = e.msg;
            }
          }
          this.loading = false;
        }
      );
  }
}
