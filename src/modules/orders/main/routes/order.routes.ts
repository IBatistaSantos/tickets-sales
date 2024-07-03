import Elysia from "elysia";
import { makeCreateOrderControllerFactory } from "../factories/controller/CreateOrderControllerFactory";
import { adaptRoute } from "@main/infrastructure/adapters/routes/adapters/ElysiaAdapter";

export default function orderRoutes(app: Elysia): Elysia {
  const createOrderController = makeCreateOrderControllerFactory();

  app.group("/orders", (group) => {
    group.post("/", adaptRoute(createOrderController));
    return group;
  });

  return app;
}
