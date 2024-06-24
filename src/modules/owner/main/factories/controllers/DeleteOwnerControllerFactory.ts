
import { DeleteOwnerController } from '../../../application/controller/DeleteOwnerController'
import { makeDeleteOwnerUseCaseFactory } from '../useCases/DeleteOwnerFactory'



export const makeDeleteOwnerControllerFactory = () => {
  const deleteOwnerUseCase = makeDeleteOwnerUseCaseFactory()
  return new DeleteOwnerController(deleteOwnerUseCase)
}