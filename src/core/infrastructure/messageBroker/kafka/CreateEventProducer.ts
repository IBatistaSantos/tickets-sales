


import { Partitioners } from 'kafkajs';
import kafka from './config';
import { randomUUID } from 'crypto';

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const createEvent = async () => {
  await producer.connect();
  
  const message = {
    idOrganizador: randomUUID(),
    nome: 'Show de rock',
    tipo: "PRESENCIAL"
  };

  await producer.send({
    topic: 'create-event',
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });

  await producer.disconnect();
};

createEvent().catch((error) => {
  console.error(error);
  process.exit(1);
})