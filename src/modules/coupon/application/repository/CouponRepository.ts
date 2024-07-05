import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export interface CouponRepository {
  findByCode(code: string, ownerId: string): Promise<Coupon | null>;
  listTicketByIds(ids: string[], ownerId: string): Promise<Ticket[]>;
  save(coupon: Coupon): Promise<void>;
}