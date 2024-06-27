import { CreateCartUseCase } from "@modules/cart/application/useCases/CreateCart";
import { PrismaCartRepository } from "@modules/cart/infrastructure/repository/PrismaCartRepository";

export const makeCreateCartUseCase = (): CreateCartUseCase => {
  const repository = new PrismaCartRepository();
  return new CreateCartUseCase(repository);
};
