import { FindCartUseCase } from "@modules/cart/application/useCases/FindCart";
import { PrismaCartRepository } from "@modules/cart/infrastructure/repository/PrismaCartRepository";

export const makeFindCartUseCase = (): FindCartUseCase => {
  const repository = new PrismaCartRepository();
  return new FindCartUseCase(repository);
};
