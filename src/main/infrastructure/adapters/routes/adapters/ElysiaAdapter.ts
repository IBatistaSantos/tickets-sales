import { Context } from "elysia";
import { BaseController } from "../../../../../core/application/controller/BaseController";


export const adaptRoute = (controller: BaseController) => {
  return async (ctx: Context) => {
    
    const body = ctx.body as object;
    const params = ctx.params as object;
    const query = ctx.query as object;

    const req = {
      ...body,
      ...params,
      ...query,
    };

    const response = await controller.handle(req);

    ctx.set.status = response.statusCode;
    ctx.body = response.data;

    return ctx.body;
  };
};
