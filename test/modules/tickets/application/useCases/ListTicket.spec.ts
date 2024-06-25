import { beforeEach, describe, expect, it, spyOn } from "bun:test";

import { MockTicketRepository } from '../../mocks/repository/MockTicketRepository';
import { ListTicketUseCase } from "../../../../../src/modules/tickets/application/useCases/ListTicket";
import { TicketRepository } from "../../../../../src/modules/tickets/application/repository/TicketRepository";
import { Ticket } from "../../../../../src/modules/tickets/domain/entity/Ticket";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";


describe("ListTicket", () => {
  let useCase: ListTicketUseCase
  let repository: TicketRepository

  beforeEach(() => {
    repository = new MockTicketRepository()
    useCase = new ListTicketUseCase(repository)

    repository.save(new Ticket({
      name: "Person",
      ownerId: "owner-id",
      price: {
        price: 100
      },
      stock: {
        type: "UNLIMITED"
      }
    }))

  })

  it("should list tickets", async () => {
    const tickets = await useCase.execute("owner-id")

    expect(tickets).toHaveLength(1)
    expect(tickets[0].name).toBe("Person")
    expect(tickets[0].accessType).toBe('DIGITAL')
  })

  it("should throw an error if owner does not exist", async () => {
    repository.getOwnerById = spyOn(repository, 'getOwnerById').mockResolvedValue(null)
    expect(useCase.execute("owner-any")).rejects.toThrowError(OwnerNotFoundException)
  })
})