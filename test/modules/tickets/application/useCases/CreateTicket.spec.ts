import { beforeEach, describe, expect, it } from "bun:test";
import { CreateTicket } from "../../../../../src/modules/tickets/application/useCases/CreateTicket";
import { TicketRepository } from "../../../../../src/modules/tickets/application/repository/TicketRepository";
import {
  Ticket,
  TicketSaleStatus,
} from "../../../../../src/modules/tickets/domain/entity/Ticket";
import { Currency } from "../../../../../src/modules/tickets/domain/valueObject/TicketPrice";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";
import { TicketAlreadyExistsException } from "../../../../../src/modules/tickets/domain/errors/TicketAlreadyExists";
import { ValidationError } from "../../../../../src/core/domain/errors/ValidationError";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";

describe("CreateTicket", () => {
  let useCase: CreateTicket;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new CreateTicket(repository);
  });

  it("should create a ticket", async () => {
    const input = {
      name: "Ticket name",
      ownerId: "owner-id",
      price: {
        value: 100,
        currency: "BRL",
      },
      stock: {
        quantity: 100,
      },
    };

    const ticket = await useCase.execute({
      name: input.name,
      ownerId: input.ownerId,
      price: {
        price: 100,
      },
      stock: {
        type: "UNLIMITED",
      },
    });

    expect(ticket.name).toBe(input.name);
    expect(ticket.ownerId).toBe(input.ownerId);
    expect(ticket.saleStatus).toBe(TicketSaleStatus.AVAILABLE);
    expect(ticket.hidden).toBeFalsy();
    expect(ticket.price).toEqual({
      price: 100,
      currency: Currency.BRL,
    });
  });

  it("should throw an error if owner does not exist", async () => {
    try {
      await useCase.execute({
        name: "Ticket name",
        ownerId: "owner-id",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OwnerNotFoundException);
    }
  });

  it("should throw an error if ticket already exists", async () => {
    repository.save(
      new Ticket({
        name: "Ticket name",
        ownerId: "owner-id",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
      })
    );

    await expect(
      useCase.execute({
        name: "Ticket name",
        ownerId: "owner-id",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
      })
    ).rejects.toThrowError(TicketAlreadyExistsException);
  });

  it("should throw an error if owner does not allow presencial tickets", async () => {
    try {
      await useCase.execute({
        name: "Ticket name",
        ownerId: "owner-id",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
        accessType: "PRESENCIAL",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
    }
  });
});
