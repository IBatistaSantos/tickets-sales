import { z } from "zod";
import { BaseController, Response } from "../../../../core/application/controller/BaseController";
import { UpdateOwner } from "../useCases/UpdateOwner";

interface UpdateOwnerInput {
  ownerId: string;
  name: string;
}

export class UpdateOwnerController extends BaseController {
  private useCase: UpdateOwner;
  constructor(useCase: UpdateOwner) {
    super();
    this.useCase = useCase;
  }

  protected async execute(req: UpdateOwnerInput): Promise<Response> {
    const schema = z.object({
      ownerId: z.string(),
      name: z.string().optional()
    });

   this.validate(schema, req);

    const result = await this.useCase.execute(req);

    return {
      statusCode: 200,
      data: result
    };
  }
}