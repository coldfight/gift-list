import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { Subscription, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { GiftService } from "../../services/gift.service";
import { Recipient } from "../../interfaces/recipient.interface";
import { RecipientService } from "../../services/recipient.service";
import { Gift } from "../../interfaces/gift.interface";
import { ActivatedRoute } from "@angular/router";
import { switchMap, map, take } from "rxjs/operators";

@Component({
  selector: "gift-edit",
  templateUrl: "./gift-edit.page.html",
  styleUrls: ["./gift-edit.page.scss"]
})
export class GiftEditPage implements OnInit, OnDestroy {
  loading = false;
  errors: { [key: string]: string } = {};
  gift: Gift;
  private _activatedRouteSubscription: Subscription;

  form: FormGroup;

  validationMessages = {
    name: [{ type: "required", message: "Gift name is required" }],
    price: [{ type: "min", message: "Not a valid price" }]
  };

  constructor(
    public formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _giftService: GiftService,
    private _recipientService: RecipientService,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl("", Validators.compose([Validators.min(0)]))
    });

    this._activatedRouteSubscription = this._activatedRoute.params
      .pipe(
        switchMap(params => {
          return this._giftService.fetchGift(params["id"]);
        }),
        take(1)
      )
      .subscribe(gift => {
        if (!gift) {
          // @todo: Display a toast error saying this no longer exists?
          return this._navController.navigateBack("/app/tabs/gifts");
        }
        this.gift = gift;
        this.form.patchValue({ name: gift.name, price: gift.price });
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

    this.gift.name = this.form.get("name").value;
    this.gift.price = this.form.get("price").value;

    this._giftService.updateGift(this.gift.id, this.gift).subscribe(
      () => {
        this._navController.navigateBack("/app/tabs/gifts");
        this.form.reset();
        this.loading = false;
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
