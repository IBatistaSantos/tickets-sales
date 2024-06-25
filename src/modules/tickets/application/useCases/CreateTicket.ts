import { OwnerNotFoundException } from "../../../owner/domain/errors/OwnerNotFound";
import { Ticket } from "../../domain/entity/Ticket";
import { TicketPriceProps } from "../../domain/valueObject/TicketPrice";
import { TicketStockProps } from "../../domain/valueObject/TicketStock";
import { TicketRepository } from "../repository/TicketRepository";
import { TicketAlreadyExistsException } from "../../domain/errors/TicketAlreadyExists";
import { ValidationError } from "../../../../core/domain/errors/ValidationError";

interface Input {
  ownerId: string;
  name: string;
  price: TicketPriceProps;
  stock: TicketStockProps;
  description?: string;
  accessType?: string;
  categoryId?: string;
}

export class CreateTicket {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(input: Input) {
    const { name, ownerId, accessType } = input;
    const owner = await this.ticketRepository.getOwnerById(ownerId);

    if (!owner) {
      throw new OwnerNotFoundException();
    }

    const accessTypeOwner = owner.accessType;

    if (!accessType) {
      input.accessType = accessTypeOwner;
    }

    if (accessTypeOwner === "DIGITAL" && input.accessType === "PRESENCIAL") {
      throw new ValidationError("Owner does not allow presencial tickets");
    }

    if (accessTypeOwner === "PRESENCIAL" && input.accessType === "DIGITAL") {
      throw new ValidationError("Owner does not allow digital tickets");
    }


    const ticketExists = await this.ticketRepository.findByName(name, ownerId);

    if (ticketExists) {
      throw new TicketAlreadyExistsException(name);
    }

    const ticket = new Ticket({
      name: input.name,
      ownerId: input.ownerId,
      price: input.price,
      stock: input.stock,
      categoryId: input.categoryId,
      accessType: input.accessType,
    });

    await this.ticketRepository.save(ticket);

    return ticket.toJSON();
  }
}
