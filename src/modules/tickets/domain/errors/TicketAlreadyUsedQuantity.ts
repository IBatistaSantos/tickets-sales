import { BaseError } from "../../../../core/domain/errors/BaseError";


export class TicketAlreadyUsedQuantity extends BaseError {
  constructor() {
    super('"Cannot delete a ticket with used quantity greater than 0."');
    this.name = "TicketAlreadyUsedQuantity";
  }
}