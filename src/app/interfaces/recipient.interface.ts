import { Gift } from "./gift.interface";

export interface Recipient {
  id: string;
  name: string;
  spendLimit?: number;
  finished?: boolean;
  gifts?: Gift[];
}
