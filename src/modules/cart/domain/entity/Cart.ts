import { BaseEntity, BaseEntityProps } from "@core/domain/entity/BaseEntity";
import { ValidationError } from "@core/domain/errors/ValidationError";

import { CartItem, CartItemProps } from "./valueObject/CarItem";
import { CartCustomer, CartCustomerProps } from "./valueObject/CartCustomer";

interface CartTotal {
  discount: number;
  amount: number;
}

export interface CartUpdateData {
  items?: CartItemProps[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, any>;
}

interface CartProps extends BaseEntityProps {
  ownerId: string;
  items: CartItemProps[];
  customer?: CartCustomerProps;
  total?: CartTotal;
  marketingData?: Record<string, any>;
}

export class Cart extends BaseEntity {
  private _ownerId: string;
  private _items: CartItem[];
  private _customer: CartCustomer | null;
  private _total: CartTotal;
  private _marketingData: Record<string, any> = {};

  constructor(props: CartProps) {
    super(props);
    this._ownerId = props.ownerId;
    this._items = props.items.map((item) => new CartItem(item));
    this._customer = props.customer ? new CartCustomer(props.customer) : null;
    this._marketingData = props.marketingData || {};
    this._total = this.calculateTotal();

    this.validate();
  }

  get ownerId() {
    return this._ownerId;
  }

  get items() {
    return this._items;
  }

  get customer() {
    return this._customer;
  }

  get total() {
    return this._total;
  }

  get marketingData() {
    return this._marketingData;
  }

  update(data: Omit<Partial<CartUpdateData>, "items">) {
    if (data.customer) {
      this._customer = new CartCustomer(data.customer);
    }

    if (data.marketingData) {
      this._marketingData = data.marketingData;
    }

    this.validate();
  }

  updateItems(items: CartItem[]) {
    this._items = items;
    this._total = this.calculateTotal();
    this.validate();
  }

  private calculateTotal() {
    if (!this._items.length) {
      return { discount: 0, amount: 0 };
    }

    return {
      discount: this._items.reduce((acc, item) => acc + item.discount, 0),
      amount: this._items.reduce((acc, item) => acc + item.total, 0),
    };
  }

  private validate() {
    if (!this._items.length) {
      throw new ValidationError("Cart must have at least one item");
    }

    if (!this._ownerId) {
      throw new ValidationError("Cart must have an owner");
    }

    if (this._total.amount < 0) {
      throw new ValidationError(
        "Cart total amount must be greater than or equal to 0"
      );
    }

    if (this._total.discount < 0) {
      throw new ValidationError(
        "Cart total discount must be greater than or equal to 0"
      );
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ownerId: this._ownerId,
      items: this._items.map((item) => item.toJSON()),
      customer: this._customer?.toJSON(),
      total: this._total,
      marketingData: this._marketingData,
    };
  }
}
