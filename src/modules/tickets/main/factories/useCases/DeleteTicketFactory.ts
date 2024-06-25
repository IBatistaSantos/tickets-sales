import { DeleteTicketUseCase } from "../../../application/useCases/DeleteTicket";
import { PrismaTicketRepository } from "../../../infrastructure/repository/PrismaTicketRepository";

export const makeDeleteTicketFactory = () => {
  const repository = new PrismaTicketRepository();
  return new DeleteTicketUseCase(repository);
};
