import { BaseEntity, BaseEntityProps } from "@core/domain/entity/BaseEntity";
import { ValidationError } from "@core/domain/errors/ValidationError";

import { CartItem, CartItemProps } from "./valueObject/CarItem";
import { CartCustomer, CartCustomerProps } from "./valueObject/CartCustomer";
import { PriceCalculator } from "@core/domain/entity/PriceCalculator";

export enum CartStatus {
  OPEN = "OPEN",
  CHECKED_OUT = "CHECKED_OUT",
}

interface ListPrices {
  id: string;
  price: number;
}

interface CouponCart {
  code: string;
  discount: {
    type: "PERCENTAGE" | "INTEGER";
    value: number;
  };
  enforceInTickets: string[];
}

export interface CartUpdateData {
  items?: CartItemProps[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, any>;
}

interface CartProps extends BaseEntityProps {
  ownerId: string;
  items: CartItemProps[];
  statusCart?: CartStatus;
  customer?: CartCustomerProps;
  couponId?: string;
  marketingData?: Record<string, any>;
}

export class Cart extends BaseEntity {
  private _ownerId: string;
  private _items: CartItem[];
  private _customer: CartCustomer | null;
  private _statusCart: CartStatus;
  private _marketingData: Record<string, any> = {};
  private _couponId: string | null;

  constructor(props: CartProps) {
    super(props);
    this._ownerId = props.ownerId;
    this._items = props.items.map((item) => new CartItem(item));
    this._customer = props.customer ? new CartCustomer(props.customer) : null;
    this._marketingData = props.marketingData || {};
    this._statusCart = props.statusCart || CartStatus.OPEN;
    this._couponId = props.couponId || null;

    this.validate();
  }

  get ownerId() {
    return this._ownerId;
  }

  get items() {
    return this._items;
  }

  get statusCart() {
    return this._statusCart;
  }

  get customer() {
    return this._customer;
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
    this.validate();
  }

  checkout() {
    if (this._statusCart === CartStatus.CHECKED_OUT) {
      throw new ValidationError("Cart already checked out");
    }

    this._items.forEach((item) => item.checkout());
    this._statusCart = CartStatus.CHECKED_OUT;
  }

  addCoupon(couponId: string) {
    if (this._couponId) {
      throw new ValidationError("Cart already has a coupon");
    }

    this._couponId = couponId;
  }

  removeCoupon() {
    this._couponId = null;
  }

  calculateTotal(listTicket: ListPrices[], coupon?: CouponCart) {
    const listItems = this._items.map((item) => {
      const ticket = listTicket.find((ticket) => ticket.id === item.itemId);
      return {
        quantity: item.quantity,
        itemId: item.itemId,
        price: ticket?.price || 0,
      };
    });

    return PriceCalculator.calculate(listItems, coupon);
  }

  private validate() {
    if (!this._items.length) {
      throw new ValidationError("Cart must have at least one item");
    }

    if (!this._ownerId) {
      throw new ValidationError("Cart must have an owner");
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ownerId: this._ownerId,
      statusCart: this._statusCart,
      items: this._items.map((item) => item.toJSON()),
      customer: this._customer?.toJSON(),
      marketingData: this._marketingData,
    };
  }
}
