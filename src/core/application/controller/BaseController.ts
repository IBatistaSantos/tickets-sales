import { ZodSchema } from "zod";
import { BaseError } from "../../domain/errors/BaseError";
import { ValidationError } from "../../domain/errors/ValidationError";

export interface Response {
  statusCode: number;
  data: any;
}

export type Request = Record<string, any>;

export abstract class BaseController {
  protected abstract execute<T>(req: Request): Promise<Response>;

  public async handle(req: Request): Promise<Response> {
    try {
      return await this.execute(req);
    } catch (err) {
      if (err instanceof BaseError) {
        return {
          statusCode: 400,
          data: { message: err.message },
        };
      }

      console.error(err);

      return {
        statusCode: 500,
        data: { message: "Internal server error" },
      };
    }
  }

  protected validate<T>(schema: ZodSchema, data: T): void {
    const result = schema.safeParse(data);
    if (!result.success) {
      const message = result.error.errors
        .map((error) => error.message)
        .join(", ");
      throw new ValidationError(message);
    }
  }
}
