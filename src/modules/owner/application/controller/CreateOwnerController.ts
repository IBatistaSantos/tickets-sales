import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { CreateOwnerUseCase } from "../useCases/CreateOwner";

interface CreateOwnerInput {
  name: string;
  organizerId: string;
}

export class CreateOwnerController extends BaseController {
  private useCase: CreateOwnerUseCase;

  constructor(useCase: CreateOwnerUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(req: CreateOwnerInput): Promise<Response> {
    const schema = z.object({
      name: z.string(),
      organizerId: z.string(),
    });

    this.validate(schema, req);

    const result = await this.useCase.execute(req);

    return {
      statusCode: 201,
      data: result,
    };
  }
}
