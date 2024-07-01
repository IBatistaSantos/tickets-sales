import { z } from "zod";
import {
  BaseController,
  Response,
} from "@core/application/controller/BaseController";
import { CreateOrderUsecase } from "../useCases/CreateOrder";
import { OrderCustomerProps } from "@modules/orders/domain/entity/valueObject/Customer";
import { BillingAddressProps } from "@modules/orders/domain/entity/valueObject/BillingAddress";
import { DocumentFactory } from "@core/domain/entity/DocumentFactory";
import { ValidationError } from "@core/domain/errors/ValidationError";

interface CreateOwnerInput {
  cartId: string;
  customer: OrderCustomerProps;
  billingAddress: BillingAddressProps;
  payment?: {
    method: string;
    cardHash: string;
  };
  marketingData?: Record<string, any>;
}

export class CreateOrderController extends BaseController {
  private useCase: CreateOrderUsecase;

  constructor(useCase: CreateOrderUsecase) {
    super();
    this.useCase = useCase;
  }

  protected async execute(req: CreateOwnerInput): Promise<Response> {
    const schema = z
      .object({
        cartId: z.string({ message: "Cart id is required"}),
        customer: z.object({
          name: z.string(),
          email: z.string().email(),
          document: z.string(),
          documentType: z.enum(["CPF", "CNPJ"]),
          phone: z.string(),
        }),
        billingAddress: z.object({
          street: z.string(),
          number: z.string().optional(),
          complement: z.string().optional(),
          neighborhood: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
        }),
        payment: z
          .object({
            method: z.string(),
            cardHash: z.string().optional(),
          })
          .optional(),
        marketingData: z.record(z.any()).optional(),
      })
      .refine((data) => {
        if (data.payment?.method === "credit_card" && !data.payment.cardHash) {
          throw new ValidationError("Card hash is required");
        }

        DocumentFactory.create(
          data.customer.documentType,
          data.customer.document
        );

        return true;
      });

    this.validate(schema, req);

    const result = await this.useCase.execute(req);

    return {
      statusCode: 201,
      data: result,
    };
  }
}
