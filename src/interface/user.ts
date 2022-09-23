import { CreditCard } from "./payment";

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: number;
  address?: string;
  avatarUrl?: string | File;
  role: string;
  isDeleted?: boolean;
  isEmailVerified?: boolean;
  isResetPassword?: Boolean;
  googleId?: string;
  facebookId?: string;
  creditCards?: CreditCard;
  cartId?: string;
}
