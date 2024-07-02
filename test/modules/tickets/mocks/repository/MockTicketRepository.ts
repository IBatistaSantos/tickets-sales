import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";
import { TicketRepository } from "../../../../../src/modules/tickets/application/repository/TicketRepository";
import { Ticket } from "../../../../../src/modules/tickets/domain/entity/Ticket";

export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [];

  async findAll(ownerId: string): Promise<Ticket[]> {
    return Promise.resolve(
      this.tickets.filter((ticket) => ticket.ownerId === ownerId)
    );
  }

  async findByIds(ticketIds: string[], ownerId: string): Promise<Ticket[]> {
    return Promise.resolve(
      this.tickets.filter(
        (ticket) => ticketIds.includes(ticket.id) && ticket.ownerId === ownerId
      ).sort((a, b) => a.position - b.position)
    );
  }

  async updateMany(tickets: Ticket[]): Promise<void> {
    tickets.forEach((ticket) => {
      const index = this.tickets.findIndex(
        (t) => t.id === ticket.id && t.ownerId === ticket.ownerId
      );
      this.tickets[index] = ticket;
    });
    return Promise.resolve();
  }

  findOne(query: any): Promise<Ticket | null> {
    return Promise.resolve(
      this.tickets.find(
        (ticket) => ticket.id === query.id && ticket.ownerId === query.ownerId
      ) || null
    );
  }

  findById(ticketId: string): Promise<Ticket | null> {
    return Promise.resolve(
      this.tickets.find((ticket) => ticket.id === ticketId) || null
    );
  }

  findByName(name: string, ownerId: string): Promise<Ticket | null> {
    return Promise.resolve(
      this.tickets.find(
        (ticket) => ticket.name === name && ticket.ownerId === ownerId
      ) || null
    );
  }

  listTickets(ownerId: string): Promise<Ticket[]> {
    return Promise.resolve(
      this.tickets.filter((ticket) => ticket.ownerId === ownerId)
    );
  }

  getOwnerById(ownerId: string): Promise<Owner> {
    return Promise.resolve(
      new Owner({
        id: ownerId,
        name: "Owner name",
        organizerId: "organizer-id",
        accessType: "DIGITAL",
      })
    );
  }

  save(ticket: Ticket): Promise<void> {
    this.tickets.push(ticket);
    return Promise.resolve();
  }

  update(ticket: Ticket): Promise<void> {
    const index = this.tickets.findIndex(
      (t) => t.id === ticket.id && t.ownerId === ticket.ownerId
    );

    if (index < 0) {
      return Promise.reject();
    }

    this.tickets[index] = ticket;
    return Promise.resolve();
  }
}
