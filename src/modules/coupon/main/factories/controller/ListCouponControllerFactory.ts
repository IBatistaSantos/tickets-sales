import { ListCouponController } from "@modules/coupon/application/controllers/ListCouponController";
import { makeListCouponFactory } from "../useCases/ListCouponFactory";

export const makeListCouponControllerFactory = () => {
  return new ListCouponController(makeListCouponFactory());
};
