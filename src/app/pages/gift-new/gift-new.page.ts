import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { GiftService } from "../../services/gift.service";
import { Recipient } from "../../interfaces/recipient.interface";
import { IonicSelectableComponent } from "ionic-selectable";
import { Subscription } from "rxjs";
import { RecipientService } from "../../services/recipient.service";

@Component({
  selector: "gift-new",
  templateUrl: "./gift-new.page.html",
  styleUrls: ["./gift-new.page.scss"]
})
export class GiftNewPage implements OnInit, OnDestroy {
  recipients: Recipient[];
  recipient: Recipient;
  private recipientsSubscription: Subscription;

  form: FormGroup;

  validationMessages = {
    name: [{ type: "required", message: "Gift name is required" }],
    price: [{ type: "min", message: "Not a valid price" }]
  };

  constructor(
    public formBuilder: FormBuilder,
    private _giftService: GiftService,
    private _recipientService: RecipientService
  ) {}

  ngOnInit() {
    this.recipientsSubscription = this._recipientService.recipients.subscribe(
      (recipients: Recipient[]) => {
        this.recipients = recipients;
      }
    );

    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl("", Validators.compose([Validators.min(0)])),
      recipient: new FormControl("")
    });
  }

  ngOnDestroy() {
    if (this.recipientsSubscription) {
      this.recipientsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this._recipientService.fetchRecipients().subscribe();
  }

  onSubmit() {}

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
