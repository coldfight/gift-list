import { Component, OnInit, OnDestroy } from "@angular/core";
import { GiftService } from "../../services/gift.service";
import { Gift } from "../../interfaces/gift.interface";
import { Subscription } from "rxjs";

@Component({
  selector: "gift-list",
  templateUrl: "./gift-list.page.html",
  styleUrls: ["./gift-list.page.scss"]
})
export class GiftListPage implements OnInit, OnDestroy {
  private _giftsSubscription: Subscription;

  gifts: Gift[];
  loading = false;

  constructor(private _giftService: GiftService) {}

  ngOnInit() {
    this.loading = true;
    this._giftsSubscription = this._giftService.gifts.subscribe(
      (gifts: Gift[]) => {
        this.gifts = gifts;
        this.loading = false;

        console.log("Getting [GIFTS] from [GIFT LIST]: ", this.gifts);
      }
    );
  }

  ngOnDestroy() {
    if (this._giftsSubscription) {
      this._giftsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.loading = true;
    this._giftService.fetchGifts().subscribe();
  }

  onEdit(id: string) {}

  onDelete(id: string) {}

  onAddGift() {
    console.log("Open the form to add a new gift...");
  }
}
