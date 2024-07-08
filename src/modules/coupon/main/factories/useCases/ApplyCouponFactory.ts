import { ApplyCouponUseCase } from "@modules/coupon/application/useCases/ApplyCoupon";
import { PrismaCouponRepository } from "@modules/coupon/infrastructure/repository/PrismaCouponRepository";

export const makeApplyCouponFactory = () => {
  const repository = new PrismaCouponRepository();
  return new ApplyCouponUseCase(repository);
};
