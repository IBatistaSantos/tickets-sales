import { ValidationError } from "@core/domain/errors/ValidationError";

export interface BillingAddressProps {
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country?: string;
}

export class BillingAddress {
  private _street: string;
  private _number: string;
  private _complement: string;
  private _neighborhood: string;
  private _city: string;
  private _state: string;
  private _zipcode: string;
  private _country: string;

  constructor(props: BillingAddressProps) {
    this._street = props.street;
    this._number = props.number || "S/N";
    this._complement = props.complement || "";
    this._neighborhood = props.neighborhood;
    this._city = props.city;
    this._state = props.state;
    this._zipcode = props.zipcode;
    this._country = props.country || "BR";

    this.validate();
  }

  get street() {
    return this._street;
  }

  get number() {
    return this._number;
  }

  get complement() {
    return this._complement;
  }

  get neighborhood() {
    return this._neighborhood;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get zipcode() {
    return this._zipcode;
  }

  get country() {
    return this._country;
  }

  get address() {
    return `${this._street}, ${this._number} - ${this._neighborhood}, ${this._city} - ${this._state}, ${this._zipcode}, ${this._country}`;
  }

  private validate() {
    if (!this._street) {
      throw new ValidationError("Street is required");
    }

    if (!this._neighborhood) {
      throw new ValidationError("Neighborhood is required");
    }

    if (!this._city) {
      throw new ValidationError("City is required");
    }

    if (!this._state) {
      throw new ValidationError("State is required");
    }

    if (!this._zipcode) {
      throw new ValidationError("Zipcode is required");
    }

    if (!this._country) {
      throw new ValidationError("Country is required");
    }
  }

  toJSON() {
    return {
      street: this._street,
      number: this._number,
      complement: this._complement,
      neighborhood: this._neighborhood,
      city: this._city,
      state: this._state,
      zipcode: this._zipcode,
      country: this._country,
    };
  }
}
