import { Elysia } from "elysia";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeCreateCouponControllerFactory } from "../factories/controller/CreateCouponControllerFactory";

export default function couponRoutes(app: Elysia): Elysia {
  const createCouponController = makeCreateCouponControllerFactory();

  app.group("/coupons", (group) => {
    group.post("/", adaptRoute(createCouponController));

    return group;
  });

  return app;
}
