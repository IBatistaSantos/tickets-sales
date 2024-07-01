import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { CreateCartUseCase } from "../useCases/CreateCart";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import { CartUser } from "@modules/cart/domain/entity/valueObject/CarItem";
import { ValidationError } from "@core/domain/errors/ValidationError";

interface ItemInput {
  itemId: string;
  quantity: number;
  users?: CartUser[];
}

interface Input {
  ownerId: string;
  items: ItemInput[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, string>;
}

export class CreateCartController extends BaseController {
  private useCase: CreateCartUseCase;

  constructor(useCase: CreateCartUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        ownerId: z.string(),
        items: z.array(
          z.object({
            itemId: z.string(),
            quantity: z
              .number()
              .min(1, { message: "Quantity must be greater than 0" }),
            users: z
              .array(
                z.object({
                  name: z.string(),
                  email: z.string().email(),
                  infoExtra: z.record(z.string()).optional(),
                })
              )
              .optional(),
          })
        ),
        customer: z
          .object({
            name: z.string(),
            email: z.string().email(),
          })
          .optional(),
        marketingData: z.record(z.string()).optional(),
      })
      .refine((data) => {
        if (!data.items.length) {
          throw new ValidationError("Items must not be empty");
        }

        return true;
      });

    this.validate(schema, input);

    const result = await this.useCase.execute(input);

    return {
      statusCode: 201,
      data: result,
    };
  }
}
