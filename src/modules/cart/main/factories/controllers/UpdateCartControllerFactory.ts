import { makeUpdateCartUseCase } from "../useCases/UpdateCartFactory";
import { UpdateCartController } from "@modules/cart/application/controllers/UpdateCartController";

export const makeUpdateCartController = (): UpdateCartController => {
  return new UpdateCartController(makeUpdateCartUseCase());
};
