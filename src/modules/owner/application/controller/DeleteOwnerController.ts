import { z } from "zod";
import { BaseController, Response } from "../../../../core/application/controller/BaseController";
import { DeleteOwner } from "../useCases/DeleteOwner";

interface DeleteOwnerInput {
  ownerId: string;
}

export class DeleteOwnerController extends BaseController {
  private useCase: DeleteOwner;
  constructor(useCase: DeleteOwner) {
    super();
    this.useCase = useCase;
  }

  protected async execute(req: DeleteOwnerInput): Promise<Response> {
    const schema = z.object({
      ownerId: z.string()
    });

   this.validate(schema, req);

    const result = await this.useCase.execute(req.ownerId);

    return {
      statusCode: 200,
      data: result
    };
  }
}