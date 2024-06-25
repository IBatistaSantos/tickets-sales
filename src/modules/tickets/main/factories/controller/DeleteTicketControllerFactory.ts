import { DeleteTicketController } from "../../../application/controllers/DeleteTicketController";
import { makeDeleteTicketFactory } from "../useCases/DeleteTicketFactory";

export const makeDeleteTicketControllerFactory = (): DeleteTicketController => {
  return new DeleteTicketController(makeDeleteTicketFactory());
};
