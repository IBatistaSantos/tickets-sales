import { faker } from "@faker-js/faker";
import { CartRepository } from "@modules/cart/application/repository/CartRepository";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { Owner } from "@modules/owner/domain/entity/Owner";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export class MockCartRepository implements CartRepository {
  private carts: Cart[] = [];

  async save(cart: Cart): Promise<void> {
    this.carts.push(cart);
  }

  async update(cart: Cart): Promise<void> {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    this.carts[index] = cart;
  }

  async findById(cartId: string): Promise<Cart | null> {
    return this.carts.find((cart) => cart.id === cartId) || null;
  }

  async getOwnerId(ownerId: string): Promise<Owner | null> {
    return new Owner({
      name: faker.person.fullName(),
      organizerId: faker.database.mongodbObjectId(),
    });
  }

  async getTicketsByIds(ticketIds: string[]): Promise<Ticket[]> {
    return Promise.resolve(
      ticketIds.map(
        (ticketId) =>
          new Ticket({
            id: ticketId,
            name: faker.commerce.productName(),
            price: {
              price: faker.number.float(),
            },
            ownerId: faker.database.mongodbObjectId(),
            stock: {
              type: "LIMITED",
              total: 3,
            },
          })
      )
    );
  }
}
