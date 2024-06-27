import { CreateCartController } from "@modules/cart/application/controllers/CreateCartController";
import { makeCreateCartUseCase } from "../useCases/CreateCartFactory";

export const makeCreateCartController = (): CreateCartController => {
  return new CreateCartController(makeCreateCartUseCase());
};
