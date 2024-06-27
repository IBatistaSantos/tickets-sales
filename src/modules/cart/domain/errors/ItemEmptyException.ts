import { BaseError } from "@core/domain/errors/BaseError";



export class ItemEmptyException extends BaseError {
  constructor() {
    super("Items cannot be empty");
    this.name = "ItemEmptyException";
  }
}