import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { RecipientService } from "../../services/recipient.service";
import { Recipient } from "../../interfaces/recipient.interface";
import { ActivatedRoute } from "@angular/router";
import { switchMap, take } from "rxjs/operators";

@Component({
  selector: "recipient-edit",
  templateUrl: "./recipient-edit.page.html",
  styleUrls: ["./recipient-edit.page.scss"]
})
export class RecipientEditPage implements OnInit, OnDestroy {
  private _activatedRouteSubscription: Subscription;
  loading = false;
  errors: { [key: string]: string } = {};
  recipient: Recipient;
  form: FormGroup;

  validationMessages = {
    name: [{ type: "required", message: "Recipient name is required" }],
    price: [{ type: "min", message: "Not a valid price" }]
  };

  constructor(
    public formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _navController: NavController,
    private _recipientService: RecipientService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      spendLimit: new FormControl("", Validators.compose([Validators.min(0)]))
    });

    this._activatedRouteSubscription = this._activatedRoute.params
      .pipe(
        switchMap(params => {
          return this._recipientService.fetchRecipient(params["id"]);
        }),
        take(1)
      )
      .subscribe(recipient => {
        if (!recipient) {
          // @todo: Display a toast error saying this no longer exists?
          return this._navController.navigateBack("/app/tabs/recipients");
        }
        this.recipient = recipient;
        this.form.patchValue({
          name: recipient.name,
          spendLimit: recipient.spendLimit
        });
      });
  }

  ngOnDestroy() {
    if (this._activatedRouteSubscription) {
      this._activatedRouteSubscription.unsubscribe();
    }
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

    this.recipient.name = this.form.get("name").value;
    this.recipient.spendLimit = this.form.get("spendLimit").value;

    // once we submit this form, we might need to redirect back to the gift page
    this._recipientService
      .updateRecipient(this.recipient.id, this.recipient)
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
