import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import {
  CartItem,
  CartUser,
} from "@modules/cart/domain/entity/valueObject/CarItem";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { PriceItemResponse } from "@core/domain/entity/PriceCalculator";

interface InputItem {
  itemId: string;
  quantity: number;
  users?: CartUser[];
}

interface UpdateCartDTO {
  items: InputItem[];
  customer: CartCustomerProps;
  marketingData?: Record<string, string>;
}

export class UpdateCartUseCase {
  constructor(private repository: CartRepository) {}

  async execute(cartId: string, data: UpdateCartDTO) {
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new CartNotFoundException();

    const ticketIds = data.items.map((item) => item.itemId);
    const listTickets = await this.repository.getTicketsByIds(ticketIds);

    const listItemCart = CartItem.createMany(data.items, listTickets);
    cart.updateItems(listItemCart);

    cart.update({
      customer: data.customer,
      marketingData: data.marketingData,
    });

    const listPrice = this.buildListPrice(listTickets);
    const { items, totals } = cart.calculateTotal(listPrice);

    const cartItems = this.buildCartItems(cart.items, listTickets, items);

    await this.repository.update(cart);

    return {
      ...cart.toJSON(),
      items: cartItems,
      total: totals.amount,
    };
  }

  private buildListPrice(tickets: Ticket[]) {
    return tickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }));
  }

  private buildCartItems(
    items: CartItem[],
    listTickets: Ticket[],
    itemsWithPrice: PriceItemResponse[]
  ) {
    const itemPriceMap = new Map(
      itemsWithPrice.map((item) => [item.itemId, item])
    );

    const ticketMap = new Map(listTickets.map((ticket) => [ticket.id, ticket]));

    return items.map((item) => {
      const ticket = ticketMap.get(item.itemId);
      const priceItem = itemPriceMap.get(item.itemId);

      return {
        name: ticket?.name,
        price: ticket?.price.price,
        ...priceItem,
        users: item.users,
      };
    });
  }
}
