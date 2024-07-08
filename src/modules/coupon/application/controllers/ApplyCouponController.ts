import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { ApplyCouponUseCase } from "../useCases/ApplyCoupon";

interface Input {
  cartId: string;
  code: string;
}

export class ApplyCouponController extends BaseController {
  private useCase: ApplyCouponUseCase;

  constructor(useCase: ApplyCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      cartId: z.string(),
      code: z.string({ message: "The code is required" }),
    });

    this.validate(schema, input);

    const result = await this.useCase.execute({
      cartId: input.cartId,
      code: input.code.toUpperCase().trim(),
    });

    return {
      statusCode: 200,
      data: result,
    };
  }
}
