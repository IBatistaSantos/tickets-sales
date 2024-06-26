export enum Currency {
  BRL = "BRL",
  USD = "USD",
  EUR = "EUR",
}

export interface TicketPriceProps {
  price: number;
  currency?: Currency;
}

export class TicketPrice {
  private _price: number;
  private _currency: Currency;

  constructor(props: TicketPriceProps) {
    this._price = props.price;
    this._currency = props.currency || Currency.BRL;

    this.validate();
  }

  get price(): number {
    return this._price;
  }

  get currency(): string {
    return this._currency;
  }

  update(props: TicketPriceProps) {
    this._price = props.price;
    this._currency = props.currency || Currency.BRL;

    this.validate();
  }

  toJSON(): TicketPriceProps {
    return {
      price: this.price,
      currency: this.currency as Currency,
    };
  }

  private validate() {
    if (!this._price) {
      throw new Error("Price is required");
    }

    const currencyValues = Object.values(Currency);

    if (!currencyValues.includes(this._currency)) {
      throw new Error("Invalid currency");
    }

    if (this._price < 0) {
      throw new Error("Price must be greater than 0");
    }
  }
}
