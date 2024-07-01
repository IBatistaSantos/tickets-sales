import { CreateOrderController } from "@modules/orders/application/controller/CreateOrderController";
import { makeCreateOrderFactory } from "../useCases/CreateOrderFactory";


export const makeCreateOrderControllerFactory = (): CreateOrderController => {
  const useCase = makeCreateOrderFactory();
  return new CreateOrderController(useCase);
}