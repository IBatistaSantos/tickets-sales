import { OwnerNotFoundException } from "../../../owner/domain/errors/OwnerNotFound";
import { TicketRepository } from "../repository/TicketRepository";

export class ListTicketUseCase {
  constructor(private repository: TicketRepository) {}

  async execute(ownerId: string) {
    const owner = await this.repository.getOwnerById(ownerId);

    if (!owner) {
      throw new OwnerNotFoundException();
    }

    const listTickets = await this.repository.listTickets(ownerId);

    return listTickets.map((ticket) => {
      return {
        id: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        stock: ticket.stock,
        accessType: ticket.accessType,
        position: ticket.position,
        categoryId: ticket.categoryId,
      };
    });
  }
}
