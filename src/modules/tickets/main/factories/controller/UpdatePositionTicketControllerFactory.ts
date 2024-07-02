import { UpdatePositionTicketController } from "@modules/tickets/application/controllers/UpdatePositionTicketController";
import { makeUpdatePositionTicket } from "../useCases/UpdatePositionTicketFactory";

export const makeUpdatePositionTicketControllerFactory =
  (): UpdatePositionTicketController => {
    return new UpdatePositionTicketController(makeUpdatePositionTicket());
  };
