import { BaseEntity, BaseEntityProps } from "@core/domain/entity/BaseEntity";
import {
  BillingAddress,
  BillingAddressProps,
} from "./valueObject/BillingAddress";
import { OrderCustomer, OrderCustomerProps } from "./valueObject/Customer";
import { OrderItem, OrderItemProps } from "./valueObject/OrderItem";

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED_PARTIAL = "refunded_partial",
  REFUNDED = "refunded",
  CANCELED = "canceled",
}

interface OrderTotal {
  amount: number;
  discount: number;
  tax: number;
}

interface OrderPayment {
  method: string;
  gateway: string;
  gatewayId: string;
  information?: Record<string, any>;
}

interface OrderProps extends BaseEntityProps {
  customer: OrderCustomerProps;
  billingAddress: BillingAddressProps;
  items: OrderItemProps[];
  marketingData?: Record<string, string>;
  statusOrder?: OrderStatus;
  payment?: OrderPayment;
}

export class Order extends BaseEntity {
  private _customer: OrderCustomer;
  private _billingAddress: BillingAddress;
  private _marketingData?: Record<string, string>;
  private _statusOrder: OrderStatus;
  private _items: OrderItem[];
  private _total: OrderTotal;
  private _payment?: OrderPayment;

  constructor(props: OrderProps) {
    super(props);
    this._customer = new OrderCustomer(props.customer);
    this._billingAddress = new BillingAddress(props.billingAddress);
    this._marketingData = props.marketingData;
    this._statusOrder = props.statusOrder || OrderStatus.PENDING;
    this._items = props.items.map((item) => new OrderItem(item));
    this._payment = props.payment;
    this._total = this.calculateTotal();

    this.validate();
  }

  get customer() {
    return this._customer;
  }

  get isFree() {
    return this._total.amount === 0;
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._total;
  }

  get billingAddress() {
    return this._billingAddress;
  }

  get marketingData() {
    return this._marketingData;
  }

  get statusOrder() {
    return this._statusOrder;
  }

  get payment() {
    return this._payment;
  }

  private calculateTotal() {
    const amount = this._items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    return {
      amount,
      discount: 0,
      tax: 0,
    };
  }

  private validate() {
    if (this._items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    if (this.isFree) {
      this._statusOrder = OrderStatus.PAID;

      this._payment = {
        method: "free",
        gateway: "free",
        gatewayId: "free",
      };
    }

    if (!this.isFree && !this._payment) {
      throw new Error("Order must have a payment data");
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      customer: this._customer,
      items: this._items.map((item) => item.toJSON()),
      billingAddress: this._billingAddress.toJSON(),
      payment: this._payment,
      total: this._total,
      marketingData: this._marketingData,
      statusOrder: this._statusOrder,
    };
  }
}
