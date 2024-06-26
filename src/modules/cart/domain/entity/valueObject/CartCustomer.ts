export interface CartCustomerProps {
  name: string;
  email: string;
}

export class CartCustomer {
  private _name: string;
  private _email: string;

  constructor(props: CartCustomerProps) {
    this._email = props.email;
    this._name = props.name;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  toJSON() {
    return {
      name: this._name,
      email: this._email,
    };
  }
}
