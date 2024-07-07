import { Elysia } from "elysia";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeCreateCouponControllerFactory } from "../factories/controller/CreateCouponControllerFactory";
import { makeDetailCouponControllerFactory } from "../factories/controller/DetailCouponControllerFactory";
import { makeListCouponControllerFactory } from "../factories/controller/ListCouponControllerFactory";

export default function couponRoutes(app: Elysia): Elysia {
  const createCouponController = makeCreateCouponControllerFactory();
  const detailCouponController = makeDetailCouponControllerFactory();
  const listCouponController = makeListCouponControllerFactory();

  app.group("/coupons", (group) => {
    group.post("/", adaptRoute(createCouponController));
    group.get("/:couponId", adaptRoute(detailCouponController));
    group.get("/owner/:ownerId", adaptRoute(listCouponController));

    return group;
  });

  return app;
}
