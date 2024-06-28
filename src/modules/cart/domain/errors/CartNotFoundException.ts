import { BaseError } from "@core/domain/errors/BaseError";

export class CartNotFoundException extends BaseError {
  constructor() {
    super("Cart not found");
    this.name = "CartNotFoundError";
  }
}
