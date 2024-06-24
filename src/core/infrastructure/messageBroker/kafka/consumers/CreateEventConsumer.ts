import { makeCreateOwnerUseCaseFactory } from "../../../../../modules/owner/main/factories/useCases/CreateOwnerFactory";
import kafka from "../config";

interface CreateEventPayload {
  idOrganizador: string;
  nome: string;
  tipo: string;
}

const consumer = kafka.consumer({ groupId: "create-event" });
const createOwnerUseCase = makeCreateOwnerUseCaseFactory();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "create-event" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Message received");
      if (!message || !message.value) return;
      const payload = JSON.parse(
        message.value.toString()
      ) as CreateEventPayload;

      try {
        const input = {
          organizerId: payload.idOrganizador,
          name: payload.nome,
          accessType: payload.tipo,
        };

        await createOwnerUseCase.execute(input);
        console.log("Owner created");
      } catch (error) {
        console.error(error);
      }
    },
  });
};

run().catch((error) => {
  console.error(error);
});

export default run;
