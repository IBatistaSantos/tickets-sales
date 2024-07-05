import { CouponRepository } from "@modules/coupon/application/repository/CouponRepository";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export class MockCouponRepository implements CouponRepository {
  private coupons: Coupon[] = [];

  async findByCode(code: string, ownerId: string): Promise<Coupon | null> {
    return (
      this.coupons.find(
        (coupon) => coupon.code === code && coupon.ownerId === ownerId
      ) || null
    );
  }

  async listTicketByIds(ids: string[]): Promise<Ticket[]> {
    return ids.map(
      (id) =>
        new Ticket({
          id,
          name: "Ticket",
          ownerId: "OWNER_ID",
          price: {
            price: 100,
          },
          stock: {
            type: "LIMITED",
          },
        })
    );
  }

  async save(coupon: Coupon): Promise<void> {
    this.coupons.push(coupon);
  }
}
