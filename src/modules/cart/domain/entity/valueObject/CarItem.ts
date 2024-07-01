import { ValidationError } from "@core/domain/errors/ValidationError";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export interface CartUser {
  name: string;
  email: string;
  infoExtra?: Record<string, string>;
}

interface InputItem {
  itemId: string;
  quantity: number;
  users?: CartUser[];
}

export interface CartItemProps {
  itemId: string;
  quantity: number;
  users?: CartUser[];
}

export class CartItem {
  private _itemId: string;
  private _quantity: number;
  private _users: CartUser[];

  constructor(props: CartItemProps) {
    this._itemId = props.itemId;
    this._quantity = props.quantity;
    this._users = props.users || [];

    this.validate();
  }

  get itemId() {
    return this._itemId;
  }

  get quantity() {
    return this._quantity;
  }

  get users() {
    return this._users;
  }

  checkout() {
    if (this._quantity <= 0) {
      throw new ValidationError("Quantity must be greater than 0");
    }

    if (this._users.length !== this._quantity) {
      throw new ValidationError("Users must be equal to quantity");
    }

    this._users.forEach((user) => {
      if (!user.name) {
        throw new ValidationError("User name is required");
      }

      if (!user.email) {
        throw new ValidationError("User email is required");
      }
    });
  }

  static createMany(items: InputItem[], tickets: Ticket[]): CartItem[] {
    const ticketMap = CartItem.createTicketMap(tickets);

    return items.map((item) => {
      const ticket = ticketMap.get(item.itemId);

      if (!ticket) {
        throw new ValidationError(`Ticket with id ${item.itemId} not found`);
      }

      if (!this.validateTicket(ticket, item.quantity)) {
        throw new ValidationError(
          `Ticket with name ${ticket.name} has no stock`
        );
      }

      if (ticket.saleStatus !== "AVAILABLE") {
        throw new ValidationError(
          `Ticket with name ${ticket.name} is not available`
        );
      }

      return new CartItem({
        itemId: item.itemId,
        quantity: item.quantity,
        users: item.users,
      });
    });
  }

  private static createTicketMap(tickets: Ticket[]): Map<string, Ticket> {
    const ticketMap = new Map<string, Ticket>();
    tickets.forEach((ticket) => ticketMap.set(ticket.id, ticket));
    return ticketMap;
  }

  private static validateTicket(ticket: Ticket, quantity: number): boolean {
    
    return ticket && ticket.stock.validateStock(quantity);
  }

  validate() {
    if (!this._itemId) {
      throw new ValidationError("Item Id is required");
    }

    if (this._quantity <= 0) {
      throw new ValidationError("Quantity must be greater or equal than 0");
    }

    if (this.users.length > this.quantity) {
      throw new ValidationError("Users must be less than quantity");
    }
  }

  toJSON() {
    return {
      itemId: this._itemId,
      quantity: this._quantity,
      users: this._users,
    };
  }
}
