import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { PauseSalesTicket } from "../useCases/PauseSalesTicket";

interface Input {
  ticketId: string;
  ownerId: string;
}

export class PauseSalesTicketController extends BaseController {
  private useCase: PauseSalesTicket;

  constructor(useCase: PauseSalesTicket) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      ticketId: z.string(),
    });

    this.validate(schema, input);

    await this.useCase.execute(input.ticketId);

    return {
      statusCode: 200,
      data: null,
    };
  }
}
