import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { ListCouponUseCase } from "../useCases/ListCoupon";

interface Input {
  ownerId: string;
}

export class ListCouponController extends BaseController {
  private useCase: ListCouponUseCase;

  constructor(useCase: ListCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      ownerId: z.string(),
    });

    this.validate(schema, input);

    const result = await this.useCase.execute(input);

    return {
      statusCode: 200,
      data: result,
    };
  }
}
