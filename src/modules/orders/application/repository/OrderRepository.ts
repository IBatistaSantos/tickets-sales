import { Cart } from "@modules/cart/domain/entity/Cart";
import { Order } from "@modules/orders/domain/entity/Order";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export interface OrderRepository {
  save(order: Order, transaction: any): Promise<void>;
  updateCart(cart: Cart, transaction: any): Promise<void>;
  updateTickets(tickets: Ticket[], transaction: any): Promise<void>;
  getCart(cartId: string): Promise<Cart | null>;
  getTicketsByIds(ticketIds: string[]): Promise<Ticket[]>;
}