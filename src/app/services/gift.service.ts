import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { Gift } from "../interfaces/gift.interface";
import { BehaviorSubject, Observable, of, from } from "rxjs";
import { tap, take, switchMap } from "rxjs/operators";
import { Recipient } from "../interfaces/recipient.interface";

@Injectable({
  providedIn: "root"
})
export class GiftService {
  private _gifts: BehaviorSubject<Gift[]> = new BehaviorSubject<Gift[]>([]);

  get gifts(): Observable<Gift[]> {
    return this._gifts.asObservable();
  }

  constructor(private storage: Storage) {}

  fetchGifts() {
    return from(this.storage.get("gifts")).pipe(
      take(1),
      switchMap((gifts: Gift[]) => {
        if (!gifts) {
          return this.storage.set("gifts", []);
        }
        return of(gifts);
      }),
      tap((gifts: Gift[]) => {
        this._gifts.next(gifts);
      })
    );
  }

  // @todo: Temporary
  setRecipientsFixtures() {
    const recipients: Recipient[] = [
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Brother In Law",
        spendLimit: 50,
        gifts: []
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Sister",
        spendLimit: 50,
        gifts: []
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Girlfriend",
        spendLimit: 100,
        gifts: []
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Mom",
        spendLimit: 50,
        gifts: []
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Dad",
        spendLimit: 50,
        gifts: []
      }
    ];
    return this.storage
      .set("recipients", recipients)
      .then(data => {
        return data;
      })
      .catch(err => {});
  }

  // @todo: Temporary
  async setGiftFixtures() {
    const recipients: Recipient[] = await this.storage.get("recipients");

    const gifts: Gift[] = [
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "iPhone Case",
        price: 39.99,
        recipient: recipients.filter(
          (r: Recipient) => r.name === "Brother In Law"
        )[0],
        bought: false,
        userId: "abc"
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Samsung Case",
        price: 39.99,
        recipient: recipients.filter((r: Recipient) => r.name === "Sister")[0],
        bought: false,
        userId: "abc"
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "Fitbit Versa 2",
        price: 249.99,
        recipient: recipients.filter(
          (r: Recipient) => r.name === "Girlfriend"
        )[0],
        bought: false,
        userId: "abc"
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "iPad",
        price: 699.99,
        recipient: recipients.filter((r: Recipient) => r.name === "Mom")[0],
        bought: false,
        userId: "abc"
      },
      {
        id: Math.floor(Math.random() * 10000000).toString(),
        name: "iPad",
        price: 699.99,
        recipient: recipients.filter((r: Recipient) => r.name === "Dad")[0],
        bought: false,
        userId: "abc"
      }
    ];
    return this.storage
      .set("gifts", gifts)
      .then(data => {
        console.log(data);
      })
      .catch(err => {});
  }
}
