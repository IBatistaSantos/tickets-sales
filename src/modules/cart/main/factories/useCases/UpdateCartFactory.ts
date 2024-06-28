import { UpdateCartUseCase } from "@modules/cart/application/useCases/UpdateCart";
import { PrismaCartRepository } from "@modules/cart/infrastructure/repository/PrismaCartRepository";

export const makeUpdateCartUseCase = (): UpdateCartUseCase => {
  const repository = new PrismaCartRepository();
  return new UpdateCartUseCase(repository);
};
