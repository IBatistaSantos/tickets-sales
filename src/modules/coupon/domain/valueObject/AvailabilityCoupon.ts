import { ValidationError } from "@core/domain/errors/ValidationError";

type AvailabilityType = "LIMITED" | "UNLIMITED";

export interface AvailabilityCouponProps {
  type: AvailabilityType;
  total?: number;
  quantity?: number;
}

export class AvailabilityCoupon {
  private _type: AvailabilityType;
  private _total?: number;
  private _quantity?: number;

  constructor(props: AvailabilityCouponProps) {
    this._type = props.type;
    this._total = props.total;
    this._quantity =
      props.quantity !== undefined ? props.quantity : this._total;

    this.validate();
  }

  get type(): AvailabilityType {
    return this._type;
  }

  get total(): number | undefined {
    return this._total;
  }

  get quantity(): number | undefined {
    return this._quantity;
  }

  private validate() {
    if (!this._type) {
      throw new ValidationError("availability type is required");
    }

    if (this._type !== "LIMITED" && this._type !== "UNLIMITED") {
      throw new ValidationError("Invalid availability type");
    }

    if (this._type === "LIMITED" && (!this._total || !this._quantity)) {
      throw new ValidationError("Invalid availability total or quantity");
    }
  }

  toJSON() {
    return {
      type: this._type,
      total: this._total,
      quantity: this._quantity,
    };
  }
}
