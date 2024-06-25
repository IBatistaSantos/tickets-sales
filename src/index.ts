import { Elysia } from "elysia";
import { setupRoutes } from "./main/infrastructure/adapters/routes/adapters/setupRoute";
import createOwnerConsumer from './core/infrastructure/messageBroker/kafka/consumers/CreateEventConsumer'
const app = new Elysia();


setupRoutes(app).then(() => {
  app.listen(process.env.PORT || 3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
 //  createOwnerConsumer
})


