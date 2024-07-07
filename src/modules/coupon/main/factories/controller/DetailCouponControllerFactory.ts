import { DetailCouponController } from "@modules/coupon/application/controllers/DetailCouponController";
import { makeDetailCouponFactory } from "../useCases/DetailCouponFactory";

export const makeDetailCouponControllerFactory = () => {
  return new DetailCouponController(makeDetailCouponFactory());
};
