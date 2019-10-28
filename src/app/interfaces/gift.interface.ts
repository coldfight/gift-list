import { Person } from "./person.interface";

export interface Gift {
  id: string;
  name: string;
  price: number;
  bought?: boolean;
  person: Person;
  userId: string;
}
