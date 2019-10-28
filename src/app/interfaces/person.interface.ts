import { Gift } from "./gift.interface";

export interface Person {
  id: string;
  name: string;
  spendLimit?: number;
  gifts: Gift[];
  finished?: boolean;
}
