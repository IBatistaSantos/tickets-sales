import { Elysia } from "elysia";
import { makeCreateCartController } from "../factories/controllers/CreateCartControllerFactory";
import { adaptRoute } from "@main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeFindCartController } from "../factories/controllers/FindCartControllerFactory";
import { makeUpdateCartController } from "../factories/controllers/UpdateCartControllerFactory";

export default function cartRoutes(app: Elysia): Elysia {
  const createCartController = makeCreateCartController();
  const findCartController = makeFindCartController();
  const updateCartController = makeUpdateCartController();

  console.log("[cartRoutes] POST /carts");
  console.log("[cartRoutes] GET /carts/:cartId");
  console.log("[cartRoutes] PUT /carts/:cartId");
  
  app.group("/carts", (group) => {
    group.post("/", adaptRoute(createCartController));
    group.get("/:cartId", adaptRoute(findCartController));
    group.put("/:cartId", adaptRoute(updateCartController));
    return group;
  });

  return app;
}
