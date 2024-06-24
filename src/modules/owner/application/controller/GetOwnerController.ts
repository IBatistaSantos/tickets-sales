import { z } from "zod";
import { BaseController, Response } from "../../../../core/application/controller/BaseController";
import { GetOwner } from "../useCases/GetOwner";

interface GetOwnerInput {
  ownerId: string;
}

export class GetOwnerController extends BaseController {
  private useCase: GetOwner;
  constructor(useCase: GetOwner) {
    super();
    this.useCase = useCase;
  }

  protected async execute(req: GetOwnerInput): Promise<Response> {
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