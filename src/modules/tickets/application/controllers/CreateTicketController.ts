import { z } from "zod";
import {
  BaseController,
  Request,
  Response,
} from "../../../../core/application/controller/BaseController";
import { CreateTicket } from "../useCases/CreateTicket";
import { Currency } from "../../domain/valueObject/TicketPrice";
import { TicketStockType } from "../../domain/valueObject/TicketStock";

interface Input {
  ownerId: string;
  name: string;
  price: {
    price: number;
    currency: Currency;
  };
  stock: {
    type: TicketStockType;
    quantity: number;
  };
  description?: string;
  accessType?: string;
  categoryId?: string;
}

export class CreateTicketController extends BaseController {
  private useCase: CreateTicket;

  constructor(useCase: CreateTicket) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        ownerId: z.string(),
        name: z.string(),
        price: z.object({
          price: z.number().min(0),
          currency: z.enum(["BRL", "USD", "EUR"]).optional().default("BRL"),
        }),
        stock: z.object({
          type: z.enum(["LIMITED", "UNLIMITED"]).optional(),
          quantity: z.number().min(0).optional(),
        }),
        description: z.string().optional(),
        accessType: z.string().optional(),
        categoryId: z.string().optional(),
      })
      .refine(() => {
        if (input.stock.type === "LIMITED" && !input.stock.quantity) {
          throw new Error("Stock quantity is required for limited stock");
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
