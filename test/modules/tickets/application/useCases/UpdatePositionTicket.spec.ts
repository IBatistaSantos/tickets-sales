import { TicketRepository } from "@modules/tickets/application/repository/TicketRepository";
import { UpdatePositionTicket } from "@modules/tickets/application/useCases/UpdatePositionTicket";
import { beforeEach, describe, expect, it } from "bun:test";
import { MockTicketRepository } from "../../mocks/repository/MockTicketRepository";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";

describe("UpdatePositionTicket", () => {
  let useCase: UpdatePositionTicket;
  let repository: TicketRepository;

  beforeEach(() => {
    repository = new MockTicketRepository();
    useCase = new UpdatePositionTicket(repository);
  });

  it("should update the position of the tickets", async () => {
    Array.from({ length: 3 }).forEach((_, index) => {
      repository.save(
        new Ticket({
          id: `${index + 1}`,
          ownerId: "1",
          name: `Ticket ${index + 1}`,
          price: {
            price: 100,
          },
          stock: {
            type: "LIMITED",
          },
        })
      );
    });

    const ticketIds = ["3", "2", "1"];
    const ownerId = "1";

    await useCase.execute({ ownerId, ticketIds });

    const tickets = await repository.findByIds(ticketIds, ownerId);

    expect(tickets[0].position).toBe(0);
    expect(tickets[0].name).toBe("Ticket 3");
  });
});
