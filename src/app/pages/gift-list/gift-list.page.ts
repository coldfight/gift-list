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
        gifts.map(g => console.log(g.bought));
        this.gifts = gifts;
        this.loading = false;
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

  onEdit(id: number) {}

  onDelete(id: number) {
    this._giftService.deleteGift(id).subscribe();
  }

  toggleBought(id: number) {
    const gift = this.gifts.find(g => g.id === id);
    if (!gift) {
      return;
    }
    this._giftService
      .updateGift(id, { ...gift, bought: !gift.bought })
      .subscribe();
  }
}
