
import { GetOwnerController } from '../../../application/controller/GetOwnerController'
import { makeGetOwnerUseCaseFactory } from '../useCases/GetOwnerFactory'


export const makeGetOwnerControllerFactory = () => {
  const getOwnerUseCase = makeGetOwnerUseCaseFactory()
  return new GetOwnerController(getOwnerUseCase)
}