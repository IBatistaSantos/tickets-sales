
import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { ListTicketUseCase } from "../useCases/ListTicket";

interface Input {
  ownerId: string;
}

export class ListTicketController extends BaseController {
  private useCase: ListTicketUseCase;

  constructor(useCase: ListTicketUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        ownerId: z.string(),
      })

    this.validate(schema, input);

    const result = await this.useCase.execute(input.ownerId);

    return {
      statusCode: 201,
      data: result,
    };
  }
}
