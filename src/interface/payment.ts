import { TimeStamp } from "./common";

export interface CreditCard {
  cardHolder: string;
  cardNumber: string;
  expDate: string;
  cardCVV: string;
  cardIssuer: string;
}

export interface PaymentMethod {
  credit: "Credit Cards";
  cash: "Cash";
  bankOnline: "Bank Online";
}

export type KeyPaymentMethod = keyof PaymentMethod;

export type ListCardIssuer =
  | "Visa"
  | "MasterCard"
  | "American Express"
  | "Diners Club"
  | "Discover"
  | "JCB";

export interface Payment extends TimeStamp {
  total: {
    subTotal?: number;
    discount?: number;
    shipping?: number;
    tax?: number;
    total?: number;
  };
  method: KeyPaymentMethod;
  creditCards: CreditCard;
}
