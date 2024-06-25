import { TicketAlreadyUsedQuantity } from "../../domain/errors/TicketAlreadyUsedQuantity";
import { TicketNotFoundException } from "../../domain/errors/TicketNotFoundException";
import { TicketRepository } from "../repository/TicketRepository";

export class DeleteTicketUseCase {
  constructor(private repository: TicketRepository) {}

  async execute(ticketId: string, ownerId: string) {
    const ticket = await this.repository.findById(ticketId, ownerId);

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.usedQuantity > 0) {
      throw new TicketAlreadyUsedQuantity();
    }

    ticket.deactivate()
    await this.repository.update(ticket);
  }
}
