import { ValidationError } from "../errors/ValidationError";

export class Email {
  private regex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  private _email: string;

  constructor(email: string) {
    this._email = this.sanitize(email);

    this.validate();
  }

  get value() {
    return this._email;
  }

  private validate() {
    if (!this._email) {
      throw new ValidationError("Email is required");
    }

    if (!this.regex.test(this._email)) {
      throw new ValidationError("Invalid email");
    }
  }

  private sanitize(email: string) {
    if (!email) return "";
    return email.trim().toLowerCase();
  }
}
