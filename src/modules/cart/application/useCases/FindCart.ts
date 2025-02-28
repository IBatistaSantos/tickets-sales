import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";

export class FindCartUseCase {
  constructor(private repository: CartRepository) {}

  async execute(cartId: string) {
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new CartNotFoundException();

    const ticketIds = cart.items.map((item) => item.itemId);

    const listTickets = await this.repository.getTicketsByIds(ticketIds);
    

    const listPrices = listTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }));

    const { items, totals} = cart.calculateTotal(listPrices);

    const ticketMap = new Map(items.map((ticket) => [ticket.itemId, ticket]));

    const cartItem = cart.items.map((item) => {
      const ticket = ticketMap.get(item.itemId);
      return {
        name: listTickets.find((t) => t.id === item.itemId)?.name,
        ...ticket,
        ...item.toJSON(),
      };
    });



    return {
      ...cart.toJSON(),
      items: cartItem,
      total: totals.amount,
    };
  }
}
