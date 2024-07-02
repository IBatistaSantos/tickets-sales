import { HiddenTicket } from "@modules/tickets/application/useCases/HiddenTicket";
import { PrismaTicketRepository } from "@modules/tickets/infrastructure/repository/PrismaTicketRepository";

export const makeHiddenTicket = (): HiddenTicket => {
  return new HiddenTicket(new PrismaTicketRepository());
};
