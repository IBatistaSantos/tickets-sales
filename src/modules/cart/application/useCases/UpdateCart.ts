import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import {
  CartItem,
  CartUser,
} from "@modules/cart/domain/entity/valueObject/CarItem";

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

    const ticketIds = data.items?.map((item) => item.itemId);
    const listTickets = await this.repository.getTicketsByIds(ticketIds);
    const listItemCart = CartItem.createMany(data.items, listTickets);
    cart.updateItems(listItemCart);

    cart.update({
      customer: data.customer,
      marketingData: data.marketingData,
    });

    const listPrice = listTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }))

    await this.repository.update(cart);
    const total = cart.calculateTotal(listPrice);
    return {
      ...cart.toJSON(),
      total,
    }
  }
}
