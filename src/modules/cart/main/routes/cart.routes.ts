import { Elysia } from "elysia";
import { makeCreateCartController } from "../factories/controllers/CreateCartControllerFactory";
import { adaptRoute } from "@main/infrastructure/adapters/routes/adapters/ElysiaAdapter";

export default function cartRoutes(app: Elysia): Elysia {
  const createCartController = makeCreateCartController();

  console.log("[cartRoutes] POST /carts");

  app.group("/carts", (group) => {
    group.post("/", adaptRoute(createCartController));
    return group;
  });

  return app;
}
