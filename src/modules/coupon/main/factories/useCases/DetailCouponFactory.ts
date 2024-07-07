import { CreateCouponUseCase } from "@modules/coupon/application/useCases/CreateCoupon";
import { DetailCouponUseCase } from "@modules/coupon/application/useCases/DetailCoupon";
import { PrismaCouponRepository } from "@modules/coupon/infrastructure/repository/PrismaCouponRepository";

export const makeDetailCouponFactory = () => {
  const repository = new PrismaCouponRepository();
  return new DetailCouponUseCase(repository)
}
