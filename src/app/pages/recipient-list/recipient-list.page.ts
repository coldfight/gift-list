import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Recipient } from "../../interfaces/recipient.interface";
import { RecipientService } from "../../services/recipient.service";

@Component({
  selector: "recipient-list",
  templateUrl: "./recipient-list.page.html",
  styleUrls: ["./recipient-list.page.scss"]
})
export class RecipientListPage implements OnInit, OnDestroy {
  private _recipientsSubscription: Subscription;
  recipients: Recipient[];
  loading = false;

  constructor(private _recipientService: RecipientService) {}

  ngOnInit() {
    this.loading = true;
    this._recipientsSubscription = this._recipientService.recipients.subscribe(
      (recipients: Recipient[]) => {
        this.recipients = recipients;
        this.loading = false;
        console.log(
          "Getting [RECIPIENTS] from [RECIPIENT LIST]: ",
          this.recipients
        );
      }
    );
  }

  ngOnDestroy() {
    if (this._recipientsSubscription) {
      this._recipientsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.loading = true;
    this._recipientService.fetchRecipients().subscribe();
  }

  onEdit(id: string) {}

  onDelete(id: string) {}
}
