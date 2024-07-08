import { makeApplyCouponFactory } from "../useCases/ApplyCouponFactory";
import { ApplyCouponController } from "@modules/coupon/application/controllers/ApplyCouponController";

export const makeApplyCouponControllerFactory = () => {
  return new ApplyCouponController(makeApplyCouponFactory());
};
