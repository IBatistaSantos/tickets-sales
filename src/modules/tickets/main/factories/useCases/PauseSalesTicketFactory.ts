import { PauseSalesTicket } from "@modules/tickets/application/useCases/PauseSalesTicket";
import { PrismaTicketRepository } from "@modules/tickets/infrastructure/repository/PrismaTicketRepository";

export const makePauseSalesTicket = (): PauseSalesTicket => {
  return new PauseSalesTicket(new PrismaTicketRepository());
};
