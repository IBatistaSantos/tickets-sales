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
import { HiddenTicket } from "@modules/tickets/application/useCases/HiddenTicket";

describe("HiddenTicket", () => {
  let useCase: HiddenTicket;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new HiddenTicket(repository);
  });

  it("should hidden ticket", async () => {
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

    await useCase.execute({
      ticketId: "1",
      hidden: true,
    });

    const pausedTicket = await repository.findById("1");

    expect(pausedTicket?.hidden).toBeTruthy();
  });

  it("should show ticket", async () => {
    repository.save(
      new Ticket({
        id: "1",
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        ownerId: faker.string.uuid(),
        hidden: true,
        price: {
          price: 100,
          currency: Currency.BRL,
        },
        stock: {
          type: "UNLIMITED",
        },
      })
    );

    await useCase.execute({
      ticketId: "1",
      hidden: false,
    });

    const pausedTicket = await repository.findById("1");

    expect(pausedTicket?.hidden).toBeFalsy();
  });

  it("should throw TicketNotFoundException if ticket does not exist", async () => {
    try {
      await useCase.execute({
        ticketId: "1",
        hidden: false,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TicketNotFoundException);
    }
  });
});
