import { TicketRepository } from "@modules/tickets/application/repository/TicketRepository";
import { UpdateTicketUseCase } from "@modules/tickets/application/useCases/UpdateTicket";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { beforeEach, describe, expect, it } from "bun:test";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";
import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";
import { TicketAlreadyExistsException } from "@modules/tickets/domain/errors/TicketAlreadyExists";
import { ValidationError } from "@core/domain/errors/ValidationError";


describe('UpdateTicket', () => {
  let useCase: UpdateTicketUseCase;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new UpdateTicketUseCase(repository);
    repository.save(new Ticket({
      id: '1',
      name: "Ticket 1",
      ownerId: "1",
      price: {
        price: 100
      },
      stock: {
        type: "LIMITED"
      },
    }));
  })
  
  it('should update a ticket', async () => {
    const updatedTicket = await useCase.execute({
      ticketId: '1',
      data: {
        name: "Updated Ticket 1",
        price: {
          price: 200
        }
      }
    });

    expect(updatedTicket.name).toBe("Updated Ticket 1");
    expect(updatedTicket.price.price).toBe(200);
    expect(updatedTicket.stock.type).toBe("LIMITED");
  })

  it('should throw an error if the ticket does not exist', async () => {
    expect(
      useCase.execute({
        ticketId: '2',
        data: {
          name: "Updated Ticket 1",
          price: {
            price: 200
          }
        }
      })
    ).rejects.toThrow(TicketNotFoundException)
  })

  it('should throw an error if the ticket name already exists', async () => {
    repository.save(new Ticket({
      id: '2',
      name: "Ticket 2",
      ownerId: "1",
      price: {
        price: 100
      },
      stock: {
        type: "LIMITED"
      },
    }));

    expect(
      useCase.execute({
        ticketId: '1',
        data: {
          name: "Ticket 2",
          price: {
            price: 200
          }
        }
      })
    ).rejects.toThrow(TicketAlreadyExistsException)
  })

  it('should throw an error if the ticket has already been sold', async () => {
    repository.save(new Ticket({
      id: '3',
      name: "Ticket 3",
      ownerId: "1",
      price: {
        price: 100
      },
      stock: {
        type: "LIMITED"
      },
      usedQuantity: 1
    }));

    expect(
      useCase.execute({
        ticketId: '3',
        data: {
          name: "Updated Ticket 3",
          price: {
            price: 200
          }
        }
      })
    ).rejects.toThrow(ValidationError)
  })

  it('should update the ticket if the price is the same', async () => {
    repository.save(new Ticket({
      id: '4',
      name: "Ticket 4",
      ownerId: "1",
      price: {
        price: 100
      },
      stock: {
        type: "LIMITED"
      },
      usedQuantity: 1
    }));

    const updatedTicket = await useCase.execute({
      ticketId: '4',
      data: {
        name: "Updated Ticket 4",
        price: {
          price: 100
        }
      }
    });

    expect(updatedTicket.name).toBe("Updated Ticket 4");
    expect(updatedTicket.price.price).toBe(100);
  })
})