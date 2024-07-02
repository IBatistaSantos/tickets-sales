import { TicketRepository } from "@modules/tickets/application/repository/TicketRepository";
import { PauseSalesTicket } from "@modules/tickets/application/useCases/PauseSalesTicket";
import { beforeEach, describe, expect, it } from "bun:test";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";
import {
  Ticket,
  TicketSaleStatus,
} from "@modules/tickets/domain/entity/Ticket";
import { faker } from "@faker-js/faker";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";
import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";

describe("PauseSalesTicket", () => {
  let useCase: PauseSalesTicket;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new PauseSalesTicket(repository);
  });

  it("should pause a ticket", async () => {
    repository.save(
      new Ticket({
        id: "1",
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        ownerId: faker.string.uuid(),
        price: {
          price: 100,
          currency: Currency.BRL,
        },
        stock: {
          type: "UNLIMITED",
        },
      })
    );

    await useCase.execute("1");

    const pausedTicket = await repository.findById("1");

    expect(pausedTicket?.saleStatus).toBe(TicketSaleStatus.PAUSED);
  });

  it("should throw TicketNotFoundException if ticket does not exist", async () => {
    try {
      await useCase.execute("1");
    } catch (error) {
      expect(error).toBeInstanceOf(TicketNotFoundException);
    }
  });
});
