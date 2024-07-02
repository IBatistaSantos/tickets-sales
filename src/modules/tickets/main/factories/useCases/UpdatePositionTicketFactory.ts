import { UpdatePositionTicket } from "@modules/tickets/application/useCases/UpdatePositionTicket";
import { PrismaTicketRepository } from "@modules/tickets/infrastructure/repository/PrismaTicketRepository";

export const makeUpdatePositionTicket = (): UpdatePositionTicket => {
  return new UpdatePositionTicket(new PrismaTicketRepository());
};
