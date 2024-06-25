import { OwnerNotFoundException } from "../../../owner/domain/errors/OwnerNotFound";
import { TicketRepository } from "../repository/TicketRepository";

export class ListTicketCompleteUseCase {
  constructor(private repository: TicketRepository) {}

  async execute(ownerId: string) {
    const owner = await this.repository.getOwnerById(ownerId);

    if (!owner) {
      throw new OwnerNotFoundException();
    }

    const listTicketComplete = await this.repository.findAll(ownerId);
    return listTicketComplete.map((ticket) => ticket.toJSON());
  }
}
