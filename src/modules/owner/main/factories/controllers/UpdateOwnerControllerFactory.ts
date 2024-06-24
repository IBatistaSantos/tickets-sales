import { UpdateOwnerController } from "../../../application/controller/UpdateOwnerController";
import { makeUpdateOwnerUseCaseFactory } from "../useCases/UpdateOwnerFactory";

export const makeUpdateOwnerControllerFactory = () => {
  const updateOwnerUseCase = makeUpdateOwnerUseCaseFactory();
  return new UpdateOwnerController(updateOwnerUseCase);
};
