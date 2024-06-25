import { BaseError } from "../../../../core/domain/errors/BaseError";

export class TicketNotFoundException extends BaseError {
  constructor() {
    super("Ticket not found");
    this.name = "TicketNotFoundException";
  }
}
