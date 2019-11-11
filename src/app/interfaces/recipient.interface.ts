import { Gift } from "./gift.interface";

export interface Recipient {
  id: number;
  name: string;
  spendLimit?: number;
  finished?: boolean;
  gifts?: Gift[];
}


export interface RecipientResponseData {
  id: number;
  name: string;
  spendLimit?: number;
  finished?: boolean;
  gifts?: Gift[];
  userId: number;
}
