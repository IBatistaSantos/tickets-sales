import { FindCartController } from "@modules/cart/application/controllers/FindCartController";
import { makeFindCartUseCase } from "../useCases/FindCartFactory";

export const makeFindCartController = (): FindCartController => {
  return new FindCartController(makeFindCartUseCase());
};
