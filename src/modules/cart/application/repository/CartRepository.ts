import { Cart } from "@modules/cart/domain/entity/Cart";
import { Owner } from "@modules/owner/domain/entity/Owner";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";


export interface CartRepository {
  save(cart: Cart): Promise<void>;
  update(cart: Cart): Promise<void>;
  findById(cartId: string): Promise<Cart | null>;
  getOwnerId(ownerId: string): Promise<Owner | null>;
  getTicketsByIds(ticketIds: string[]): Promise<Ticket[]>;
}