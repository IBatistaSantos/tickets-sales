import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";

export class FindCartUseCase {
  constructor(private repository: CartRepository) {}

  async execute(cartId: string) {
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new CartNotFoundException();

    const ticketIds = cart.items.map((item) => item.itemId);

    const listTickets = await this.repository.getTicketsByIds(ticketIds);
    const ticketMap = new Map(listTickets.map((ticket) => [ticket.id, ticket]));

    const cartItem = cart.items.map((item) => {
      const ticket = ticketMap.get(item.itemId);
      return {
        name: ticket?.name,
        price: ticket?.price.price,
        ...item.toJSON(),
      };
    });

    const listPrices = listTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }));
    const total = cart.calculateTotal(listPrices);

    return {
      ...cart.toJSON(),
      items: cartItem,
      total,
    };
  }
}
