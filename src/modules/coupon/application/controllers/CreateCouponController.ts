import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { CreateCouponUseCase } from "../useCases/CreateCoupon";
import { DiscountCouponProps } from "@modules/coupon/domain/valueObject/DiscountCoupon";
import { AvailabilityCouponProps } from "@modules/coupon/domain/valueObject/AvailabilityCoupon";

interface Input {
  ownerId: string;
  code: string;
  description?: string;
  discount: DiscountCouponProps;
  availability: AvailabilityCouponProps;
  enforceInTickets?: string[];
}

export class CreateCouponController extends BaseController {
  private useCase: CreateCouponUseCase;

  constructor(useCase: CreateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        ownerId: z.string(),
        code: z.string(),
        discount: z.object({
          type: z.enum(["INTEGER", "PERCENTAGE"]),
          value: z.number().min(0),
        }),
        availability: z.object({
          type: z.enum(["UNLIMITED", "LIMITED"]),
          total: z.number().min(0).optional(),
        }),
        description: z.string().optional(),
      })
      .refine(() => {
        if (
          input.availability.type === "LIMITED" &&
          !input.availability.total
        ) {
          throw new ValidationError(
            "Stock quantity is required for limited stock"
          );
        }
        return true;
      });

    this.validate(schema, input);

    const result = await this.useCase.execute({
      ...input,
      code: input.code.trim().toUpperCase(),
    });

    return {
      statusCode: 201,
      data: result,
    };
  }
}
