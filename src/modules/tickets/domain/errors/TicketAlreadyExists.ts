import { BaseError } from "@core/domain/errors/BaseError";

export class TicketAlreadyExistsException extends BaseError {
  constructor(name: string) {
    super(`Ticket with name ${name} already exists`);
    this.name = "TicketAlreadyExists";
  }
}
