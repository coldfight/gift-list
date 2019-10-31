import { Recipient } from "./recipient.interface";

export interface Gift {
  id: string;
  name: string;
  price: number;
  bought?: boolean;
  recipientId?: string;
  recipient?: Recipient; // @todo: no....
  userId?: string;
}
