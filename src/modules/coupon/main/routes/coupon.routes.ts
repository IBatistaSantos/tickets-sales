import { Elysia } from "elysia";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeCreateCouponControllerFactory } from "../factories/controller/CreateCouponControllerFactory";
import { makeDetailCouponControllerFactory } from "../factories/controller/DetailCouponControllerFactory";

export default function couponRoutes(app: Elysia): Elysia {
  const createCouponController = makeCreateCouponControllerFactory();
  const detailCouponController = makeDetailCouponControllerFactory();

  app.group("/coupons", (group) => {
    group.post("/", adaptRoute(createCouponController));
    group.get("/:couponId", adaptRoute(detailCouponController));

    return group;
  });

  return app;
}
