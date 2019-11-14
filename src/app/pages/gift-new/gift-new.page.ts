import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { IonicSelectableComponent } from "ionic-selectable";
import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { GiftService } from "../../services/gift.service";
import { Recipient } from "../../interfaces/recipient.interface";
import { RecipientService } from "../../services/recipient.service";

@Component({
  selector: "gift-new",
  templateUrl: "./gift-new.page.html",
  styleUrls: ["./gift-new.page.scss"]
})
export class GiftNewPage implements OnInit, OnDestroy {
  loading = false;
  errors: { [key: string]: string } = {};
  newRecipient: Recipient;
  recipients: Recipient[];
  private _recipientsSubscription: Subscription;
  private _newRecipientSubscription: Subscription;

  form: FormGroup;

  validationMessages = {
    name: [{ type: "required", message: "Gift name is required" }],
    price: [{ type: "min", message: "Not a valid price" }]
  };

  constructor(
    public formBuilder: FormBuilder,
    private _giftService: GiftService,
    private _recipientService: RecipientService,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this._recipientsSubscription = this._recipientService.recipients.subscribe(
      (recipients: Recipient[]) => {
        this.recipients = recipients;
        console.log("Getting [RECIPIENTS] from [GIFT NEW]: ", this.recipients);
      }
    );

    this._newRecipientSubscription = this._recipientService.newRecipient.subscribe(
      (recipient: Recipient) => {
        // recipientId is a misnomer. It's actually the Recipient but to keep
        // it in sync with backend validation, I called it recipientId
        this.form.patchValue({ recipientId: recipient });
      }
    );

    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl(null, Validators.compose([Validators.min(0)])),
      recipientId: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy() {
    if (this._recipientsSubscription) {
      this._recipientsSubscription.unsubscribe();
    }

    if (this._newRecipientSubscription) {
      this._newRecipientSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this._recipientService.fetchRecipients().subscribe();
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

    this._giftService
      .addGift(
        this.form.value["name"],
        this.form.value["price"],
        this.form.value["recipientId"]["id"]
      )
      .subscribe(
        result => {
          this.loading = false;
          this.form.reset();
          this._navController.navigateBack("/app/tabs/gifts");
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

  addNewRecipient() {
    this._navController.navigateForward("/app/tabs/gifts/new/recipients/new");
  }

  searchRecipients(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    const text = event.text
      .replace(/ /g, "")
      .trim()
      .toLowerCase();

    event.component.startSearch();
    if (text) {
      event.component.items = this.recipients.filter(recipient => {
        return (
          recipient.name
            .replace(/ /gi, "")
            .toLowerCase()
            .indexOf(text) !== -1
        );
      });
    } else {
      event.component.items = this.recipients;
    }
    event.component.endSearch();
  }
}
