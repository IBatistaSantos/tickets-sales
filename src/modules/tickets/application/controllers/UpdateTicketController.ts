import { z } from "zod";
import {
  BaseController,
  Response,
} from "../../../../core/application/controller/BaseController";
import { Currency } from "../../domain/valueObject/TicketPrice";
import { TicketStockType } from "../../domain/valueObject/TicketStock";
import { UpdateTicketUseCase } from "../useCases/UpdateTicket";
import { ValidationError } from "@core/domain/errors/ValidationError";

interface Input {
  ticketId: string;
  ownerId?: string;
  name?: string;
  price?: {
    price: number;
    currency: Currency;
  };
  stock?: {
    type: TicketStockType;
    total: number;
  };
  description?: string;
  accessType?: string;
  categoryId?: string;
}

export class UpdateTicketController extends BaseController {
  private useCase: UpdateTicketUseCase;

  constructor(useCase: UpdateTicketUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(input: Input): Promise<Response> {
    const schema = z
      .object({
        ticketId: z.string(),
        ownerId: z.string().optional(),
        name: z.string().optional(),
        price: z.object({
          price: z.number().min(0),
          currency: z.enum(["BRL", "USD", "EUR"]).optional().default("BRL"),
        }).optional(),
        stock: z.object({
          type: z.enum(["LIMITED", "UNLIMITED"]).optional(),
          total: z.number().min(0).optional(),
        }).optional(),
        description: z.string().optional(),
        accessType: z.string().optional(),
        categoryId: z.string().optional(),
      })
      .refine(() => {
        if (!input.stock) return true;
        if (input.stock.type === "LIMITED" && !input.stock.total) {
          throw new ValidationError("Stock total is required for limited stock");
        }
        return true;
      });

    this.validate(schema, input);

    
    const {ticketId, ...data} = input;

    const result = await this.useCase.execute({
      ticketId: input.ticketId,
      data
    });

    return {
      statusCode: 200,
      data: result,
    };
  }
}
