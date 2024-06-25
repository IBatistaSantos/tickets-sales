import { ListTicketCompleteUseCase } from "../../../application/useCases/ListTicketComplete";
import { PrismaTicketRepository } from "../../../infrastructure/repository/PrismaTicketRepository";



export const makeListTicketCompleteFactory = (): ListTicketCompleteUseCase  => {
  const repository = new PrismaTicketRepository()
  return new ListTicketCompleteUseCase(repository)
}