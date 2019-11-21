import { Pipe, PipeTransform } from "@angular/core";
import { Gift } from "../interfaces/gift.interface";

@Pipe({
  name: "boughtGift"
})
export class BoughtGiftPipe implements PipeTransform {
  transform(gifts: Gift[], bought = true): any {
    return gifts.filter((g: Gift) => bought === g.bought);
  }
}
