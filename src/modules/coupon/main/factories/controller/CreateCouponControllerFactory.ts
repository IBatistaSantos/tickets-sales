import { CreateCouponController } from "@modules/coupon/application/controllers/CreateCouponController";
import { makeCreateCouponFactory } from "../useCases/CreateCouponFactory";

export const makeCreateCouponControllerFactory = () => {
  return new CreateCouponController(makeCreateCouponFactory());
};
