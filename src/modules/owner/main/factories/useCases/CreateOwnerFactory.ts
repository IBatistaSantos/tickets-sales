import { CreateOwnerUseCase } from "../../../application/useCases/CreateOwner";
import { OwnerRepositoryPrisma } from "../../../infrastructure/repository/OwnerRepositoryPrisma";

export const makeCreateOwnerUseCaseFactory = () => {
  return new CreateOwnerUseCase(new OwnerRepositoryPrisma());
};
