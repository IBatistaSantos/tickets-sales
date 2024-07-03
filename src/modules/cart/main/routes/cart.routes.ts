import { Elysia } from "elysia";
import { makeCreateCartController } from "../factories/controllers/CreateCartControllerFactory";
import { adaptRoute } from "@main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeFindCartController } from "../factories/controllers/FindCartControllerFactory";
import { makeUpdateCartController } from "../factories/controllers/UpdateCartControllerFactory";

export default function cartRoutes(app: Elysia): Elysia {
  const createCartController = makeCreateCartController();
  const findCartController = makeFindCartController();
  const updateCartController = makeUpdateCartController();

  app.group("/carts", (group) => {
    group.post("/", adaptRoute(createCartController));
    group.get("/:cartId", adaptRoute(findCartController));
    group.put("/:cartId", adaptRoute(updateCartController));
    return group;
  });

  return app;
}
