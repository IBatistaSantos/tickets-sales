import { UpdateTicketUseCase } from "@modules/tickets/application/useCases/UpdateTicket";
import { PrismaTicketRepository } from "@modules/tickets/infrastructure/repository/PrismaTicketRepository";

export const makeUpdateTicketUseCase = (): UpdateTicketUseCase => {
  const repository = new PrismaTicketRepository();
  return new UpdateTicketUseCase(repository);
};
