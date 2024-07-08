import { faker } from "@faker-js/faker";
import { Cart } from "@modules/cart/domain/entity/Cart";
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

  async getCartById(id: string): Promise<Cart | null> {
    return new Cart({
      ownerId: 'OWNER_ID',
      id,
      items: [
        {
          itemId: "1",
          quantity: 1,
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
    });
  }

  async applyCouponInCart(cart: Cart): Promise<void> {
    Promise.resolve();
  }

  async findById(id: string): Promise<Coupon | null> {
    return this.coupons.find((coupon) => coupon.id === id) || null;
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

  async listByOwnerId(ownerId: string): Promise<Coupon[]> {
    return this.coupons.filter((coupon) => coupon.ownerId === ownerId);
  }

  async save(coupon: Coupon): Promise<void> {
    this.coupons.push(coupon);
  }
}
