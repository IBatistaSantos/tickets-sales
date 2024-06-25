import { Elysia } from 'elysia';
import { adaptRoute } from '../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter';
import { makeCreateTicketController } from '../factories/controller/CreateTicketControllerFactory';
import { makeListTicketControllerFactory } from '../factories/controller/ListTicketControllerFactory';
import { makeDeleteTicketControllerFactory } from '../factories/controller/DeleteTicketControllerFactory';
import { makeListTicketCompleteFactory } from '../factories/useCases/ListTicketCompleteFactory';
import { makeListTicketCompleteControllerFactory } from '../factories/controller/ListTicketCompleteControllerFactory';


export default function ticketRoutes(app: Elysia): Elysia {
  const createTicketController = makeCreateTicketController();
  const ListTicketControllerFactory = makeListTicketControllerFactory();
  const listTicketComplete = makeListTicketCompleteControllerFactory()
  const deleteTicketController = makeDeleteTicketControllerFactory();

  console.log('[ticketRoutes] POST /tickets');
  console.log('[ticketRoutes] GET /tickets/owner/:ownerId');
  console.log('[ticketRoutes] GET /tickets/owner/:ownerId/complete');
  console.log('[ticketRoutes] DELETE /tickets/:ticketId/owner/:ownerId');

  app.group('/tickets', (group) => {
    group.post('/', adaptRoute(createTicketController));
    group.get('/owner/:ownerId', adaptRoute(ListTicketControllerFactory));
    group.get('/owner/:ownerId/complete', adaptRoute(listTicketComplete));
    group.delete('/:ticketId/owner/:ownerId', adaptRoute(deleteTicketController));
    return group;
  });

  return app;
}
