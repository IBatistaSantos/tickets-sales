

import { CreateTicket } from '../../../application/useCases/CreateTicket';
import { PrismaTicketRepository } from '../../../infrastructure/repository/PrismaTicketRepository';

export const makeCreateTicketUseCase = (): CreateTicket => {
  const repository = new PrismaTicketRepository()
  return new CreateTicket(repository)
}