import { Owner } from "../../../owner/domain/entity/Owner";
import { Ticket } from "../../domain/entity/Ticket";

export interface TicketRepository {
  findByName(name: string, ownerId: string): Promise<Ticket | null>;
  findById(ticketId: string, ownerId: string): Promise<Ticket | null>;
  findAll(ownerId: string): Promise<Ticket[]>;
  listTickets(ownerId: string): Promise<Ticket[]>;
  getOwnerById(ownerId: string): Promise<Owner | null>;
  save(ticket: Ticket): Promise<void>;
  update(ticket: Ticket): Promise<void>;
}
