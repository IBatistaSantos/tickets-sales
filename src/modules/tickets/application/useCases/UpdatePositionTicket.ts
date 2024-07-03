import { TicketRepository } from "../repository/TicketRepository";

interface Input {
  ownerId: string;
  ticketIds: string[];
}

export class UpdatePositionTicket {
  constructor(private repository: TicketRepository) {}

  async execute(input: Input) {
    const { ownerId, ticketIds } = input;
    const listTickets = await this.repository.findByIds(ticketIds, ownerId);

    const ticketMap = new Map(listTickets.map((ticket) => [ticket.id, ticket]));

    ticketIds.forEach((ticketId, index) => {
      const ticket = ticketMap.get(ticketId);
      if (ticket) {
        ticket.updatePosition(index);
      }
    });

    const updatedTickets = Array.from(ticketMap.values());

    await this.repository.updateMany(updatedTickets);
  }
}
