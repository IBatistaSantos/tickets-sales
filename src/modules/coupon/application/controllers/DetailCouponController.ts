import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { DetailCouponUseCase } from "../useCases/DetailCoupon";

interface Input {
  couponId: string;
}

export class DetailCouponController extends BaseController {
  private useCase: DetailCouponUseCase;

  constructor(useCase: DetailCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z.object({
      couponId: z.string(),
    });

    this.validate(schema, input);

    const result = await this.useCase.execute(input);

    return {
      statusCode: 200,
      data: result,
    };
  }
}
