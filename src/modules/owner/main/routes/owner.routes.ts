import { Elysia } from "elysia";
import { makeCreateOwnerController } from "../factories/controllers/CreateOwnerControllerFactory";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeGetOwnerControllerFactory } from "../factories/controllers/GetOwnerControllerFactory";
import { makeUpdateOwnerControllerFactory } from "../factories/controllers/UpdateOwnerControllerFactory";
import { makeDeleteOwnerControllerFactory } from "../factories/controllers/DeleteOwnerControllerFactory";

export default function ownerRoutes(app: Elysia): Elysia {
  const createOwnerController = makeCreateOwnerController();
  const getOwnerUseCase = makeGetOwnerControllerFactory();
  const updateOwnerController = makeUpdateOwnerControllerFactory();
  const deleteOwnerController = makeDeleteOwnerControllerFactory();

  app.group("/owners", (group) => {
    group.post("/", adaptRoute(createOwnerController));
    group.get("/:ownerId", adaptRoute(getOwnerUseCase));
    group.put("/:ownerId", adaptRoute(updateOwnerController));
    group.delete("/:ownerId", adaptRoute(deleteOwnerController));
    return group;
  });

  return app;
}
