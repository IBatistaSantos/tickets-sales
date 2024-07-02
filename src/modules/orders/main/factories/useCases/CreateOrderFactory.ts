import { KafkaProducer } from "@core/infrastructure/messageBroker/kafka/KafkaProducer";
import { CreateOrderUsecase } from "@modules/orders/application/useCases/CreateOrder";
import { PrismaOrderRepository } from "@modules/orders/infrastructure/repository/PrismaOrderRepository";
import { PrismaTransaction } from "@modules/orders/infrastructure/repository/PrismaTransaction";

export const makeCreateOrderFactory = (): CreateOrderUsecase => {
  const repository = new PrismaOrderRepository();
  const transaction = new PrismaTransaction();
  const publisher = new KafkaProducer();
  return new CreateOrderUsecase(repository, transaction, publisher);
};
