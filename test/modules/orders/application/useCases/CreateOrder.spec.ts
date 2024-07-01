import { CreateOrderUsecase } from "@modules/orders/application/useCases/CreateOrder";
import { OrderRepository } from "@modules/orders/application/repository/OrderRepository";
import { Transaction } from "@modules/orders/application/repository/Transaction";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { MockOrderRepository } from "../../mocks/repository/MockOrderRepository";
import { MockTransaction } from "../../mocks/repository/MockTransaction";
import { faker } from "@faker-js/faker";

describe("CreateOrder", () => {
  let useCase: CreateOrderUsecase;
  let repository: OrderRepository;
  let transaction: Transaction;
  let input: any;

  beforeEach(() => {
    repository = new MockOrderRepository();
    transaction = new MockTransaction();

    input = {
      cartId: faker.string.uuid(),
      customer: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        document: '01234567890',
        documentType: "CPF",
        phone: faker.phone.number(),
      },
      billingAddress: {
        city: faker.location.city(),
        country: faker.location.country(),
        neighborhood: faker.location.county(),
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      payment: {
        method: "credit_card",
      },

    }
    useCase = new CreateOrderUsecase(repository, transaction);
  });

  it("should create an order", async () => {
    const response = await useCase.execute(input);
    expect(response).toHaveProperty("orderId");
  });

  it("should throw an error when cart not found", async () => {
    spyOn(repository, "getCart").mockResolvedValueOnce(null);

    expect(useCase.execute(input))
    .rejects.toThrowError("Cart not found");
  })

  it("should throw an error when some tickets not found", async () => {
    spyOn(repository, "getTicketsByIds").mockResolvedValueOnce([]);

    expect(useCase.execute(input))
    .rejects.toThrowError("Some tickets not found");
  })
});
