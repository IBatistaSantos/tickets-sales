import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { CreateCartUseCase } from "../useCases/CreateCart";
import { CartCustomerProps } from "@modules/cart/domain/entity/valueObject/CartCustomer";
import { CartUser } from "@modules/cart/domain/entity/valueObject/CarItem";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { UpdateCartUseCase } from "../useCases/UpdateCart";

interface ItemInput {
  ticketId: string;
  quantity: number;
  users?: CartUser[];
}

interface Input {
  cartId: string;
  items: ItemInput[];
  customer?: CartCustomerProps;
  marketingData?: Record<string, string>;
}

export class UpdateCartController extends BaseController {
  private useCase: UpdateCartUseCase;

  constructor(useCase: UpdateCartUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        cartId: z.string(),
        items: z.array(
          z.object({
            ticketId: z.string(),
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
        ).optional(),
        customer: z
          .object({
            name: z.string(),
            email: z.string().email(),
          })
          .optional(),
        marketingData: z.record(z.string()).optional(),
      })
      .refine((data) => {
        if (data.items && !data.items.length) {
          throw new ValidationError("Items must not be empty");
        }

        return true;
      });

    this.validate(schema, input);

    const {cartId, ...data} = input;

    const result = await this.useCase.execute(cartId, data);

    return {
      statusCode: 200,
      data: result,
    };
  }
}
