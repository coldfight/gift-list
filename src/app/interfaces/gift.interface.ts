import { Recipient } from "./recipient.interface";

export interface Gift {
  id: string;
  name: string;
  price: number;
  bought?: boolean;
  recipient: Recipient;
  userId: string;
}
