import { Gift } from "./gift.interface";

export interface Recipient {
  id: number;
  name: string;
  spendLimit?: number;
  completed?: boolean;
  gifts?: Gift[];
}

export interface RecipientResponseData {
  id: number;
  name: string;
  spendLimit?: number;
  completed?: boolean;
  gifts?: Gift[];
  userId: number;
  updatedAt: string;
  createdAt: string;
}
