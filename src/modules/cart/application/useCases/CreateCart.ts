import { Cart } from "@modules/cart/domain/entity/Cart";
import {
  CartItem,
  CartUser,
} from "@modules/cart/domain/entity/valueObject/CarItem";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import { ItemEmptyException } from "@modules/cart/domain/errors/ItemEmptyException";
import { OwnerNotFoundException } from "@modules/owner/domain/errors/OwnerNotFound";
import { CartRepository } from "../repository/CartRepository";

interface InputItem {
  itemId: string;
  quantity: number;
  users?: CartUser[];
}

interface Input {
  ownerId: string;
  items: InputItem[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, string>;
}

export class CreateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(command: Input) {
    const { ownerId, items, customer, marketingData } = command;

    const owner = await this.cartRepository.getOwnerId(ownerId);
    if (!owner) throw new OwnerNotFoundException();

    const ticketIds = items.map((item) => item.itemId);
    if (!ticketIds.length) throw new ItemEmptyException();

    const listTickets = await this.cartRepository.getTicketsByIds(ticketIds);

    const listItemCart = CartItem.createMany(items, listTickets);

    const cart = new Cart({
      ownerId,
      items: listItemCart,
      customer,
      marketingData,
    });

    await this.cartRepository.save(cart);

    const listPrice = listTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }));
    
    const total = cart.calculateTotal(listPrice);

    return {
      ...cart.toJSON(),
      total,
    };
  }
}
