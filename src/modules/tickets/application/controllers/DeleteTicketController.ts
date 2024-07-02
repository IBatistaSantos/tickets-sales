import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { DeleteTicketUseCase } from "../useCases/DeleteTicket";

interface Input {
  ticketId: string;
  ownerId: string;
}

export class DeleteTicketController extends BaseController {
  private useCase: DeleteTicketUseCase;

  constructor(useCase: DeleteTicketUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      ticketId: z.string(),
      ownerId: z.string(),
    });

    this.validate(schema, input);

    const result = await this.useCase.execute(input.ticketId, input.ownerId);

    return {
      statusCode: 200,
      data: result,
    };
  }
}
