import { BaseError } from "../../../../core/domain/errors/BaseError";


export class OwnerNotFoundException extends BaseError {
  constructor() {
    super('Owner not found');
    this.name = 'OwnerNotFound';
  }
}