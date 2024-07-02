import { Elysia } from "elysia";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeCreateTicketController } from "../factories/controller/CreateTicketControllerFactory";
import { makeListTicketControllerFactory } from "../factories/controller/ListTicketControllerFactory";
import { makeDeleteTicketControllerFactory } from "../factories/controller/DeleteTicketControllerFactory";
import { makeListTicketCompleteControllerFactory } from "../factories/controller/ListTicketCompleteControllerFactory";
import { makeUpdateTicketControllerFactory } from "../factories/controller/UpdateTicketControllerFactory";
import { makePauseSalesTicketControllerFactory } from "../factories/controller/PauseSalesTicketControllerFactory";
import { makeHiddenTicketControllerFactory } from "../factories/controller/HiddenTicketControllerFactory";

export default function ticketRoutes(app: Elysia): Elysia {
  const createTicketController = makeCreateTicketController();
  const ListTicketControllerFactory = makeListTicketControllerFactory();
  const listTicketComplete = makeListTicketCompleteControllerFactory();
  const deleteTicketController = makeDeleteTicketControllerFactory();
  const updateTicketController = makeUpdateTicketControllerFactory();
  const pauseSalesTicketController = makePauseSalesTicketControllerFactory();

  app.group("/tickets", (group) => {
    group.post("/", adaptRoute(createTicketController));
    group.get("/owner/:ownerId", adaptRoute(ListTicketControllerFactory));
    group.get("/owner/:ownerId/complete", adaptRoute(listTicketComplete));
    group.delete(
      "/:ticketId/owner/:ownerId",
      adaptRoute(deleteTicketController)
    );
    group.put("/:ticketId", adaptRoute(updateTicketController));
    group.patch("/:ticketId/pause", adaptRoute(pauseSalesTicketController));
    group.patch(
      "/:ticketId/hidden",
      adaptRoute(makeHiddenTicketControllerFactory())
    );

    return group;
  });

  return app;
}
