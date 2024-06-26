import { UpdateTicketController } from "@modules/tickets/application/controllers/UpdateTicketController";
import { makeUpdateTicketUseCase } from "../useCases/UpdateTicketFactory";

export const makeUpdateTicketControllerFactory = (): UpdateTicketController => {
  return new UpdateTicketController(makeUpdateTicketUseCase());
};
