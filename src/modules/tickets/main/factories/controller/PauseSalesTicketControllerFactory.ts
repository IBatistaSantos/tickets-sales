import { PauseSalesTicketController } from "@modules/tickets/application/controllers/PauseSalesTicketController";
import { makePauseSalesTicket } from "../useCases/PauseSalesTicketFactory";

export const makePauseSalesTicketControllerFactory =
  (): PauseSalesTicketController => {
    return new PauseSalesTicketController(makePauseSalesTicket());
  };
