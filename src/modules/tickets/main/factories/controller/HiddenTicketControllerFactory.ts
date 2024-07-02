import { HiddenTicketController } from "@modules/tickets/application/controllers/HiddenTicketController";
import { makeHiddenTicket } from "../useCases/HiddenTicketFactory";

export const makeHiddenTicketControllerFactory = (): HiddenTicketController => {
  return new HiddenTicketController(makeHiddenTicket());
};
