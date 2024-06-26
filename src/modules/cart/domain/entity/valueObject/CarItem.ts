

interface CartUser {
  name: string;
  email: string;
  infoExtra: Record<string, string>;
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
