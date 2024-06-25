import { describe, beforeEach, expect, it, spyOn } from "bun:test";
import { ListTicketCompleteUseCase } from "../../../../../src/modules/tickets/application/useCases/ListTicketComplete";
import { TicketRepository } from "../../../../../src/modules/tickets/application/repository/TicketRepository";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";
import { Ticket } from "../../../../../src/modules/tickets/domain/entity/Ticket";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";


describe("ListTicketCompleteUseCase", () => {
  let useCase: ListTicketCompleteUseCase
  let repository: TicketRepository

  beforeEach(() => {
    repository = new MockTicketRepository()
    useCase = new ListTicketCompleteUseCase(repository)

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

  it("should list tickets with information complete", async () => {
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