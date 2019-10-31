import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, from, Subject } from "rxjs";
import { tap, take, switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Gift } from "../interfaces/gift.interface";
import { Recipient } from "../interfaces/recipient.interface";

interface GiftResponseData {
  name: string;
  bought: boolean;
  price: number;
  recipientId: string;
}

@Injectable({
  providedIn: "root"
})
export class GiftService {
  private _gifts: Subject<Gift[]> = new Subject<Gift[]>();

  get gifts(): Observable<Gift[]> {
    return this._gifts.asObservable();
  }

  constructor(private _http: HttpClient) {}

  fetchGifts(): Observable<Gift[]> {
    return this._http
      .get<{ [key: string]: GiftResponseData }>(
        `https://test-playground-646de.firebaseio.com/gifts.json`
      )
      .pipe(
        take(1),
        map(responseData => {
          const gifts: Gift[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              gifts.push({
                id: key,
                name: responseData[key].name,
                price: responseData[key].price,
                bought: responseData[key].bought,
                recipientId: responseData[key].recipientId
              });
            }
          }
          return gifts;
        }),
        tap((gifts: Gift[]) => {
          this._gifts.next(gifts);
        })
      );
  }
}
