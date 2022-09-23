import { TimeStamp } from "./common";
import { Payment } from "./payment";
import { Product } from "./product";
import { Shipping } from "./shipping";

export interface Cart {
  _id: string;
  userId: string;
  shipping: Partial<Shipping>;
  payment: Partial<Payment>;
  status: "Cart" | "Delivery" | "Payment" | "Summary";
  totalItem: number;
  isDeleted: boolean;
}

export interface CartProduct extends TimeStamp {
  productId: Product;
  quantity: number;
}

export interface HeadCells<T> {
  disablePadding: boolean;
  id: Partial<keyof T>;
  label: string;
  numeric: boolean;
}
