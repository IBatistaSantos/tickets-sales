import { ValidationError } from "@core/domain/errors/ValidationError";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

export interface CartUser {
  name: string;
  email: string;
  infoExtra?: Record<string, string>;
}

interface InputItem {
  ticketId: string;
  quantity: number;
  users?: CartUser[];
}

export interface CartItemProps {
  ticketId: string;
  quantity: number;
  price: number;
  discount?: number;
  users?: CartUser[];
}

export class CartItem {
  private _ticketId: string;
  private _quantity: number;
  private _price: number;
  private _discount: number;
  private _users: CartUser[];

  constructor(props: CartItemProps) {
    this._ticketId = props.ticketId;
    this._quantity = props.quantity;
    this._price = props.price;
    this._discount = props.discount || 0;
    this._users = props.users || [];

    this.validate();
  }

  get ticketId() {
    return this._ticketId;
  }

  get quantity() {
    return this._quantity;
  }

  get price() {
    return this._price;
  }

  get discount() {
    return this._discount;
  }

  get users() {
    return this._users;
  }

  private totalPrice() {
    return this._price * this._quantity;
  }

  get total() {
    return this.totalPrice() - this._discount;
  }

  get totalDiscount() {
    return this._discount;
  }

  static createMany(items: InputItem[], tickets: Ticket[]): CartItem[] {
    const ticketMap = CartItem.createTicketMap(tickets);

    return items.map((item) => {
      const ticket = ticketMap.get(item.ticketId);

      if (!ticket) {
        throw new ValidationError(`Ticket with id ${item.ticketId} not found`);
      }

      if (!this.validateTicket(ticket, item.quantity)) {
        throw new ValidationError(`Ticket with name ${ticket.name} has no stock`);
      }

      
      if (ticket.saleStatus !== "AVAILABLE") {
        throw new ValidationError(`Ticket with name ${ticket.name} is not available`);
      }

      return new CartItem({
        ticketId: item.ticketId,
        quantity: item.quantity,
        price: ticket.price.price,
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
    if (!this._ticketId) {
      throw new ValidationError("TicketId is required");
    }

    if (this._price < 0) {
      throw new ValidationError("Price must be greater than 0");
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
      ticketId: this._ticketId,
      quantity: this._quantity,
      price: this._price,
      discount: this._discount,
      users: this._users,
    };
  }
}
