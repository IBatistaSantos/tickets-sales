import { z } from "zod";
import { BaseController, Response } from "@core/application/controller/BaseController";
import { UpdatePositionTicket } from "../useCases/UpdatePositionTicket";

interface Input {
  ticketIds: string[];
  ownerId: string;
}

export class UpdatePositionTicketController extends BaseController {
  private useCase: UpdatePositionTicket;

  constructor(useCase: UpdatePositionTicket) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      ownerId: z.string(),
      ticketIds: z.array(z.string()),
    });

    this.validate(schema, input);

    await this.useCase.execute(input);

    return {
      statusCode: 200,
      data: null,
    };
  }
}
