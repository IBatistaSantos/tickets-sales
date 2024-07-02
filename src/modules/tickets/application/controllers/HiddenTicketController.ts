import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { PauseSalesTicket } from "../useCases/PauseSalesTicket";
import { HiddenTicket } from "../useCases/HiddenTicket";

interface Input {
  ticketId: string;
  hidden: boolean;
}

export class HiddenTicketController extends BaseController {
  private useCase: HiddenTicket;

  constructor(useCase: HiddenTicket) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      ticketId: z.string(),
      hidden: z.boolean(),
    });

    this.validate(schema, input);

    await this.useCase.execute(input);

    return {
      statusCode: 200,
      data: null,
    };
  }
}
