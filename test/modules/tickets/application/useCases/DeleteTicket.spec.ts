import { describe, beforeEach, expect, it, spyOn } from "bun:test";
import { DeleteTicketUseCase } from "../../../../../src/modules/tickets/application/useCases/DeleteTicket";
import { TicketRepository } from "../../../../../src/modules/tickets/application/repository/TicketRepository";
import { Ticket } from "../../../../../src/modules/tickets/domain/entity/Ticket";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";
import { TicketAlreadyUsedQuantity } from "../../../../../src/modules/tickets/domain/errors/TicketAlreadyUsedQuantity";

describe("DeleteTicketUseCase", () => {
  let useCase: DeleteTicketUseCase;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new DeleteTicketUseCase(repository);
  });

  it("should delete a ticket", async () => {
    repository.save(
      new Ticket({
        id: "1234",
        name: "Person",
        ownerId: "owner-2",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
        usedQuantity: 0,
      })
    );

    const updateSpyOn = spyOn(repository, "update");
    await useCase.execute("1234", "owner-2");
    expect(updateSpyOn).toBeCalledWith(
      expect.objectContaining({
        status: "INACTIVE",
      })
    );
  });

  it("should throw an error if ticket does not exist", async () => {
    expect(useCase.execute("123", "owner-any")).rejects.toThrowError();
  });

  it("should throw an error if ticket has used quantity", async () => {
    repository.save(
      new Ticket({
        id: "1234",
        name: "Person",
        ownerId: "owner-2",
        price: {
          price: 100,
        },
        stock: {
          type: "UNLIMITED",
        },
        usedQuantity: 1,
      })
    );

    expect(useCase.execute("1234", "owner-2")).rejects.toThrowError(
      TicketAlreadyUsedQuantity
    );
  });
});
