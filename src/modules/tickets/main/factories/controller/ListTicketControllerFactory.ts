import { ListTicketController } from "../../../application/controllers/ListTicketController";
import { makeListTicketFactory } from "../useCases/ListTicketFactory";



export const makeListTicketControllerFactory = (): ListTicketController => {
  return new ListTicketController(makeListTicketFactory())
}