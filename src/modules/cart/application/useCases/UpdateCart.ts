import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import {
  CartItem,
  CartUser,
} from "@modules/cart/domain/entity/valueObject/CarItem";

interface InputItem {
  ticketId: string;
  quantity: number;
  users?: CartUser[];
}

interface UpdateCartDTO {
  items?: InputItem[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, string>;
}

export class UpdateCartUseCase {
  constructor(private repository: CartRepository) {}

  async execute(cartId: string, data: UpdateCartDTO) {
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new CartNotFoundException();

    if (data.items) {
      const ticketIds = data.items.map((item) => item.ticketId);
      const listTickets = await this.repository.getTicketsByIds(ticketIds);
      const listItemCart = CartItem.createMany(data.items, listTickets);
      cart.updateItems(listItemCart);
    }

    cart.update({
     customer: data.customer,
     marketingData: data.marketingData,
    })

    await this.repository.update(cart);

    return cart.toJSON();
  }
}
