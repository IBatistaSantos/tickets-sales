import { BaseError } from "../../../../core/domain/errors/BaseError";

export class OwnerAlreadyExists extends BaseError {
  constructor() {
    super("Owner already exists.");
  }
}
