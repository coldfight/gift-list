import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { IonicSelectableComponent } from "ionic-selectable";
import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";

import { GiftService } from "../../services/gift.service";
import { Recipient } from "../../interfaces/recipient.interface";
import { RecipientService } from "../../services/recipient.service";

@Component({
  selector: "gift-new",
  templateUrl: "./gift-new.page.html",
  styleUrls: ["./gift-new.page.scss"]
})
export class GiftNewPage implements OnInit, OnDestroy {
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
        this.form.patchValue({ recipient });
      }
    );

    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl("", Validators.compose([Validators.min(0)])),
      recipient: new FormControl(null)
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

  onSubmit(data) {
    console.log(data);
  }

  addNewRecipient() {
    console.log("Add a new recipient");
    // @todo: add a new recipient and then
    // @todo: automatically set it as the form's recipient field.

    // @todo: edit this to /recipients/new and we navigate with this so we can navigate back to our form without losing entered data.
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
