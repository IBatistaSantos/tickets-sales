import { ValidationError } from "@core/domain/errors/ValidationError";

type DiscountType = "PERCENTAGE" | "INTEGER";

export interface DiscountCouponProps {
  type: DiscountType;
  value: number;
}

export class DiscountCoupon {
  private _type: DiscountType;
  private _value: number;

  constructor(props: DiscountCouponProps) {
    this._type = props.type;
    this._value = props.value;

    this.validate();
  }

  get type(): DiscountType {
    return this._type;
  }

  get value(): number {
    return this._value;
  }

  private validate() {
    if (!this._type || !this._value) {
      throw new ValidationError("Invalid discount type or value");
    }

    if (this._type !== "PERCENTAGE" && this._type !== "INTEGER") {
      throw new ValidationError("Invalid discount type");
    }

    if (this._type === "PERCENTAGE" && (this._value < 0 || this._value > 100)) {
      throw new ValidationError("Invalid value for percentage discount");
    }

    if (this._type === "INTEGER" && this._value < 0) {
      throw new ValidationError("Invalid value for integer discount");
    }
  }

  toJSON() {
    return {
      type: this._type,
      value: this._value,
    };
  }
}
