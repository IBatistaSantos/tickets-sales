import { ListTicketUseCase } from "../../../application/useCases/ListTicket";
import { PrismaTicketRepository } from "../../../infrastructure/repository/PrismaTicketRepository";



export const makeListTicketFactory = (): ListTicketUseCase  => {
  const repository = new PrismaTicketRepository()
  return new ListTicketUseCase(repository)
}