

import { CreateTicketController } from '../../../application/controllers/CreateTicketController'
import { makeCreateTicketUseCase } from '../useCases/CreateTicketFactory'

export const makeCreateTicketController = (): CreateTicketController => {
  const useCase = makeCreateTicketUseCase()
  return new CreateTicketController(useCase)
}