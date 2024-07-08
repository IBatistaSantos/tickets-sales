import { BaseEntity, BaseEntityProps } from "@core/domain/entity/BaseEntity";
import {
  DiscountCoupon,
  DiscountCouponProps,
} from "../valueObject/DiscountCoupon";
import {
  AvailabilityCoupon,
  AvailabilityCouponProps,
} from "../valueObject/AvailabilityCoupon";
import { ValidationError } from "@core/domain/errors/ValidationError";

type CouponStatus = "AVAILABLE" | "PAUSED";

interface CouponProps extends BaseEntityProps {
  code: string;
  ownerId: string;
  description?: string;
  discount: DiscountCouponProps;
  availability: AvailabilityCouponProps;
  statusCoupon?: CouponStatus;
  enforceInTickets?: string[];
  usedQuantity?: number;
}

export class Coupon extends BaseEntity {
  private _code: string;
  private _ownerId: string;
  private _description: string;
  private _discount: DiscountCoupon;
  private _availability: AvailabilityCoupon;
  private _statusCoupon: CouponStatus;
  private _enforceInTickets: string[];
  private _usedQuantity: number;

  constructor(props: CouponProps) {
    super(props);
    this._code = props.code.toUpperCase().trim();
    this._ownerId = props.ownerId;
    this._description = props.description || "";
    this._discount = new DiscountCoupon(props.discount);
    this._availability = new AvailabilityCoupon(props.availability);
    this._enforceInTickets = props.enforceInTickets || [];
    this._statusCoupon = props.statusCoupon || "AVAILABLE";
    this._usedQuantity = props.usedQuantity || 0;

    this.validate();
  }

  get code(): string {
    return this._code;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get description(): string {
    return this._description;
  }

  get discount(): {
    type: "PERCENTAGE" | "INTEGER";
    value: number;
  } {
    return this._discount.toJSON();
  }

  get availability(): {
    type: "LIMITED" | "UNLIMITED";
    total?: number;
    quantity?: number;
  } {
    return this._availability.toJSON();
  }

  get enforceInTickets(): string[] {
    return this._enforceInTickets;
  }

  get usedQuantity(): number {
    return this._usedQuantity;
  }

  get statusCoupon(): CouponStatus {
    return this._statusCoupon;
  }

  canUsed() {
    if (this._statusCoupon !== "AVAILABLE") {
      throw new ValidationError("Coupon is not available");
    }
  }

  private validate() {
    if (!this._code) {
      throw new Error("Invalid coupon code");
    }

    if (!this._ownerId) {
      throw new Error("Invalid owner id");
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      code: this.code,
      ownerId: this.ownerId,
      description: this.description,
      discount: this.discount,
      availability: this.availability,
      enforceInTickets: this.enforceInTickets,
      usedQuantity: this.usedQuantity,
    };
  }
}
