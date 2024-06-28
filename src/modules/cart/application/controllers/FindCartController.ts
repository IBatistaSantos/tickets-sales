import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { CartUser } from "@modules/cart/domain/entity/valueObject/CarItem";
import { FindCartUseCase } from "../useCases/FindCart";

interface ItemInput {
  ticketId: string;
  quantity: number;
  users?: CartUser[];
}

interface Input {
 cartId: string;
}

export class FindCartController extends BaseController {
  private useCase: FindCartUseCase;

  constructor(useCase: FindCartUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        cartId: z.string()   
      })

    this.validate(schema, input);

    const result = await this.useCase.execute(input.cartId);

    return {
      statusCode: 200,
      data: result,
    };
  }
}
