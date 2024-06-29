import { ValidationError } from "@core/domain/errors/ValidationError";

interface OrderItemUser {
  name: string;
  email: string;
  infoExtra?: Record<string, any>;
}

export interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
  users: OrderItemUser[];
}

export class OrderItem {
  private _name: string;
  private _quantity: number;
  private _price: number;
  private _users: OrderItemUser[];

  constructor(props: OrderItemProps) {
    this._name = props.name;
    this._quantity = props.quantity;
    this._price = props.price;
    this._users = props.users || [];

    this.validate();
  }

  get name() {
    return this._name;
  }

  get quantity() {
    return this._quantity;
  }

  get price() {
    return this._price;
  }

  get users() {
    return this._users;
  }

  toJSON() {
    return {
      name: this._name,
      quantity: this._quantity,
      price: this._price,
      users: this._users,
    };
  }

  private validate() {
    if (!this._name) {
      throw new ValidationError("Name is required");
    }

    if (!this._quantity) {
      throw new ValidationError("Quantity is required");
    }

    if (this._price < 0) {
      throw new ValidationError("Price must be greater than 0");
    }

    if (!this._users.length) {
      throw new ValidationError("Users is required");
    }

    if (this._users.length !== this._quantity) {
      throw new ValidationError("Users length different quantity ticket");
    }
  }
}
