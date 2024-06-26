import { TicketPriceProps } from "@modules/tickets/domain/valueObject/TicketPrice";
import { TicketRepository } from "../repository/TicketRepository";
import { TicketStockProps } from "@modules/tickets/domain/valueObject/TicketStock";
import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";
import { TicketAlreadyExistsException } from "@modules/tickets/domain/errors/TicketAlreadyExists";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { ValidationError } from "@core/domain/errors/ValidationError";

interface InputData {
  name: string;
  description: string;
  hidden: boolean;
  price: TicketPriceProps;
  stock: TicketStockProps;
}

interface Input {
  ticketId: string;
  data: Partial<InputData>;
}

export class UpdateTicketUseCase {
  constructor(private repository: TicketRepository) {}

  async execute(input: Input) {
    const { name, price } = input.data;
    const ticket = await this.repository.findById(input.ticketId);

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (name && ticket.name !== name) {
      const ticketExists = await this.repository.findByName(
        name,
        ticket.ownerId
      );

      if (ticketExists) {
        throw new TicketAlreadyExistsException(name);
      }
    }

    if (this.canUpdatePrice(ticket, price)) {
      throw new ValidationError(
        "You can't update the price of a ticket that has already been sold"
      );
    }

    ticket.update(input.data);

    await this.repository.update(ticket);

    return ticket.toJSON();
  }

  private canUpdatePrice(ticket: Ticket, price?: TicketPriceProps) {
    if (!price) return false;

    const hasTicketBeenUsed = ticket.usedQuantity > 0;
    const isPriceDifferent = ticket.price.price !== price.price;

    return price && hasTicketBeenUsed && isPriceDifferent;
  }
}
