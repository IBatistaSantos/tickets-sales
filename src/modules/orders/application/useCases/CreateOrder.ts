import { ValidationError } from "@core/domain/errors/ValidationError";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { Order } from "@modules/orders/domain/entity/Order";
import { BillingAddressProps } from "@modules/orders/domain/entity/valueObject/BillingAddress";
import { OrderCustomerProps } from "@modules/orders/domain/entity/valueObject/Customer";
import { OrderItemProps } from "@modules/orders/domain/entity/valueObject/OrderItem";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { OrderRepository } from "../repository/OrderRepository";
import { Transaction } from "../repository/Transaction";
import { EventPublisher } from "@core/domain/entity/events/EventPublisher";
import { OrderCreatedEvent } from "@modules/orders/domain/events/OrderCreatedEvent";

interface Input {
  cartId: string;
  customer: OrderCustomerProps;
  billingAddress: BillingAddressProps;
  payment?: {
    method: string;
    cardHash: string;
  };
  marketingData?: Record<string, any>;
}

export class CreateOrderUsecase {
  constructor(
    private orderRepository: OrderRepository,
    private transaction: Transaction,
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: Input) {
    const cart = await this.getValidatedCart(input.cartId);

    const ticketIds = cart.items.map((item) => item.itemId);
    const listTickets = await this.orderRepository.getTicketsByIds(ticketIds);
    if (listTickets.length !== ticketIds.length) {
      throw new ValidationError("Some tickets not found");
    }

    const ticketMap = this.createTicketMap(listTickets);
    const items = Order.createItems(cart.items, ticketMap);

    this.validateStock(items, ticketMap);

    const order = new Order({
      ownerId: cart.ownerId,
      customer: input.customer,
      billingAddress: input.billingAddress,
      payment: {
        method: input.payment?.method || "free",
      },
      cartId: input.cartId,
      marketingData: input.marketingData,
      items,
    });

    await this.transaction.execute(async (session) => {
      await this.orderRepository.save(order, session);
      await this.decreaseStock(items, ticketMap, session);
      await this.orderRepository.updateCart(cart, session);
    });

    const data = order.toJSON();
    const orderId = data.id;
    delete data.id;

    const event = new OrderCreatedEvent(this.eventPublisher, {
      orderId,
      ...data,
    });

    event.emit();

    return { orderId };
  }

  private async getValidatedCart(cartId: string): Promise<Cart> {
    const cart = await this.orderRepository.getCart(cartId);
    if (!cart) throw new CartNotFoundException();
    cart.checkout();
    return cart;
  }

  private createTicketMap(tickets: Ticket[]): Map<string, Ticket> {
    return new Map(tickets.map((ticket) => [ticket.id, ticket]));
  }

  private validateStock(items: OrderItemProps[], tickets: Map<string, Ticket>) {
    items.forEach((item) => {
      const ticket = tickets.get(item.itemId);
      if (!ticket) {
        throw new ValidationError(`Ticket with id ${item.itemId} not found`);
      }

      const stockAvailable = ticket.validateStock(item.quantity);

      if (!stockAvailable) {
        throw new ValidationError(
          `Ticket with name ${ticket.name} has no stock`
        );
      }
    });
  }

  private async decreaseStock(
    items: OrderItemProps[],
    tickets: Map<string, Ticket>,
    transaction: any
  ) {
    items.forEach((item) => {
      const ticket = tickets.get(item.itemId);
      if (!ticket) return;
      ticket.decreaseStock(item.quantity);
    });

    const listTickets = Array.from(tickets.values());
    await this.orderRepository.updateTickets(listTickets, transaction);
  }
}
