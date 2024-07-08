import { Cart } from "@modules/cart/domain/entity/Cart";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export interface CouponRepository {
  findByCode(code: string, ownerId: string): Promise<Coupon | null>;
  findById(id: string): Promise<Coupon | null>;
  getCartById(id: string): Promise<Cart | null>;
  listTicketByIds(ids: string[], ownerId: string): Promise<Ticket[]>;
  listByOwnerId(ownerId: string): Promise<Coupon[]>;
  save(coupon: Coupon): Promise<void>;
  applyCouponInCart(cart: Cart): Promise<void>;
}
