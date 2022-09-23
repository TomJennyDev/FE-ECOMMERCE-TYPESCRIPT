import apiService from "../app/apiService";
import { Cart, Response } from "../interface";

const CartApi = {
  getCartAll(): Promise<Response<Cart>> {
    const url = "/cart/me";
    return apiService.get(url);
  },
  updateCart(cart: Partial<Cart>): Promise<Response<Partial<Cart>>> {
    const url = "/cart/me/update";
    return apiService.put(url, { ...cart });
  },
  updateQuantityProductCart(
    productId: string,
    action: boolean
  ): Promise<Response<Cart>> {
    const url = "/cartitem/me/update";
    return apiService.put(url, {
      productId,
      action,
    });
  },
  removeProductCart(productId: string[]): Promise<Response<Cart>> {
    const url = "/cartitem/me/delete";
    return apiService.delete(url, {
      data: { productId },
    });
  },
};

export default CartApi;
