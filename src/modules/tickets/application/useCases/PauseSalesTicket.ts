import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";
import { TicketRepository } from "../repository/TicketRepository";

export class PauseSalesTicket {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(ticketId: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundException();
    }

    ticket.pause();
    await this.ticketRepository.update(ticket);
  }
}
