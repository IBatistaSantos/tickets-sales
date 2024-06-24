import { ZodType, ZodTypeDef, z } from "zod";
import { BaseController, Response } from "../../../../../src/core/application/controller/BaseController";
import { BaseError } from "../../../../../src/core/domain/errors/BaseError";

class MockError extends BaseError {
  constructor() {
    super('Mock error');
  }
}

export class MockController extends BaseController {
  constructor () {
    super();
  }
  protected async execute(req: any): Promise<Response> {
    const schema = z.object({
      name: z.string({
        message: 'Name is required',
      }),
    })
    if (req.body.fail) {
      throw new Error('Forced failure');
    }

    if (req.body.mockError) {
      throw new MockError();
    }

    this.validate(schema, req.body)

    return {
      statusCode: 200,
      data: { message: 'Success' },
    };
  }
}