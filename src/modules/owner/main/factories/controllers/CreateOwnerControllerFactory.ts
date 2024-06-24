import { CreateOwnerController } from "../../../application/controller/CreateOwnerController"
import { makeCreateOwnerUseCaseFactory } from "../useCases/CreateOwnerFactory"


export const makeCreateOwnerController = () => {
  return new CreateOwnerController(makeCreateOwnerUseCaseFactory())
}