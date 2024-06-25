import { ValidationError } from "../../../../core/domain/errors/ValidationError";

export type TicketStockType = "UNLIMITED" | "LIMITED";

export interface TicketStockProps {
  total?: number;
  available?: number;
  type: TicketStockType;
}

export class TicketStock {
  private _total: number;
  private _available: number;
  private _type: TicketStockType;

  constructor(props: TicketStockProps) {
    this._total = props.total || 0;
    this._available = props.available || this._total;
    this._type = props.type;

    this.validate();
  }

  get total(): number {
    return this._total;
  }

  get available(): number {
    return this._available;
  }

  get type(): TicketStockType {
    return this._type;
  }

  toJSON(): TicketStockProps {
    return {
      total: this.total,
      type: this._type,
      available: this.available,
    };
  }

  private validate() {
    const typeValues = ["UNLIMITED", "LIMITED"];

    if (!typeValues.includes(this._type)) {
      throw new ValidationError("Invalid type");
    }

    if (this._type === "LIMITED" && this._total < 0) {
      throw new ValidationError("Total must be greater than 0");
    }

    if (this._type === "LIMITED" && this._available < 0) {
      throw new ValidationError("Available must be greater than 0");
    }

    if (this._type === "LIMITED" && this._available > this._total) {
      throw new ValidationError("Available must be less than total");
    }
  }
}
