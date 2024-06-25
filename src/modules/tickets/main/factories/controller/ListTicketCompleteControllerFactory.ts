import { ListTicketCompleteController } from "../../../application/controllers/ListTicketCompleteController";
import { makeListTicketCompleteFactory } from "../useCases/ListTicketCompleteFactory";

export const makeListTicketCompleteControllerFactory =
  (): ListTicketCompleteController => {
    return new ListTicketCompleteController(makeListTicketCompleteFactory());
  };
