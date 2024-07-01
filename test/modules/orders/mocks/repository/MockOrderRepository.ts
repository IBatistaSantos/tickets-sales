import { faker } from "@faker-js/faker";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { OrderRepository } from "@modules/orders/application/repository/OrderRepository";
import { Order } from "@modules/orders/domain/entity/Order";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";

export class MockOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order, transaction: any): Promise<void> {
    this.orders.push(order);
  }

  async updateCart(cart: Cart, transaction: any): Promise<void> {
    Promise.resolve();
  }
  async updateTickets(tickets: Ticket[], transaction: any): Promise<void> {
    Promise.resolve();
  }

  async getCart(cartId: string): Promise<Cart> {
    return new Cart({
      ownerId: faker.string.uuid(),
      items: [
        {
          quantity: 1,
          itemId: faker.string.uuid(),
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.firstName(),
            },
          ],
        },
      ],
      customer: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      },
      marketingData: {},
    });
  }

  async getTicketsByIds(ticketIds: string[]): Promise<Ticket[]> {
    return ticketIds.map(
      (id) =>
        new Ticket({
          id,
          name: faker.commerce.productName(),
          price: {
            price: Number(faker.commerce.price()),
            currency: Currency.BRL,
          },
          ownerId: faker.string.uuid(),
          stock: {
            type: "LIMITED",
            total: 2,
          },
        })
    );
  }
}
