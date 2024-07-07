import { ListCouponUseCase } from "@modules/coupon/application/useCases/ListCoupon";
import { PrismaCouponRepository } from "@modules/coupon/infrastructure/repository/PrismaCouponRepository";

export const makeListCouponFactory = () => {
  const repository = new PrismaCouponRepository();
  return new ListCouponUseCase(repository);
};
