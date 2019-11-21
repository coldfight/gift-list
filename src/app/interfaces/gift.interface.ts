import { Recipient, RecipientResponseData } from "./recipient.interface";

export interface Gift {
  id: number;
  name: string;
  price: number;
  bought: boolean;
  createdAt: Date;
  updatedAt: Date;
  recipientId: number;
  userId: number;
  recipient?: { name: string; id: number };
}

export interface GiftResponseData {
  id: number;
  name: string;
  price: number;
  bought: boolean;
  createdAt: string;
  updatedAt: string;
  recipientId: number;
  userId: number;
  recipient: RecipientResponseData;
}
