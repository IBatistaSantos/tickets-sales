import { Cart } from "@modules/cart/domain/entity/Cart";
import {
  CartItem,
  CartUser,
} from "@modules/cart/domain/entity/valueObject/CarItem";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import { ItemEmptyException } from "@modules/cart/domain/errors/ItemEmptyException";
import { OwnerNotFoundException } from "@modules/owner/domain/errors/OwnerNotFound";
import { CartRepository } from "../repository/CartRepository";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { PriceItemResponse } from "@core/domain/entity/PriceCalculator";

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

    if (!items.length) throw new ItemEmptyException();

    const listTickets = await this.cartRepository.getTicketsByIds(
      items.map((item) => item.itemId)
    );

    const listItemCart = CartItem.createMany(items, listTickets);
    const cart = new Cart({
      ownerId,
      items: listItemCart,
      customer,
      marketingData,
    });

    const listPrice = listTickets.map((ticket) => ({
      id: ticket.id,
      price: ticket.price.price,
    }));

    const { totals, items: itemWithPrice } = cart.calculateTotal(listPrice);
    const itemPriceMap = new Map(
      itemWithPrice.map((item) => [item.itemId, item])
    );
    const ticketMap = new Map(listTickets.map((ticket) => [ticket.id, ticket]));
    const cartItems = this.buildCartItems(
      listItemCart,
      ticketMap,
      itemPriceMap
    );

    await this.cartRepository.save(cart);

    return {
      ...cart.toJSON(),
      items: cartItems,
      total: totals.amount,
    };
  }

  private buildCartItems(
    listItemCart: CartItem[],
    ticketMap: Map<string, Ticket>,
    itemPriceMap: Map<string, PriceItemResponse>
  ) {
    return listItemCart.map((item) => {
      const ticket = ticketMap.get(item.itemId);
      const itemWithPrice = itemPriceMap.get(item.itemId);

      return {
        name: ticket?.name,
        ...itemWithPrice,
        quantity: item.quantity,
        users: item.users,
      };
    });
  }
}
