import { Elysia } from "elysia";
import { adaptRoute } from "../../../../main/infrastructure/adapters/routes/adapters/ElysiaAdapter";
import { makeCreateCouponControllerFactory } from "../factories/controller/CreateCouponControllerFactory";
import { makeDetailCouponControllerFactory } from "../factories/controller/DetailCouponControllerFactory";
import { makeListCouponControllerFactory } from "../factories/controller/ListCouponControllerFactory";
import { makeApplyCouponControllerFactory } from "../factories/controller/ApplyCouponControllerFactory";

export default function couponRoutes(app: Elysia): Elysia {
  const createCouponController = makeCreateCouponControllerFactory();
  const detailCouponController = makeDetailCouponControllerFactory();
  const listCouponController = makeListCouponControllerFactory();
  const applyCouponController = makeApplyCouponControllerFactory();

  app.group("/coupons", (group) => {
    group.post("/", adaptRoute(createCouponController));
    group.get("/:couponId", adaptRoute(detailCouponController));
    group.get("/owner/:ownerId", adaptRoute(listCouponController));
    group.post("/apply", adaptRoute(applyCouponController));

    return group;
  });

  return app;
}
