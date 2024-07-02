import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";
import { TicketRepository } from "../repository/TicketRepository";

interface Input {
  ticketId: string;
  hidden: boolean;
}

export class HiddenTicket {
  constructor(private repository: TicketRepository) {}

  async execute(input: Input) {
    const ticket = await this.repository.findById(input.ticketId);
    if (!ticket) {
      throw new TicketNotFoundException();
    }

    input.hidden ? ticket.hide() : ticket.show();

    await this.repository.update(ticket);

    return { ticketId: ticket.id };
  }
}
