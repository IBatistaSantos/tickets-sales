import { CreateCouponUseCase } from "@modules/coupon/application/useCases/CreateCoupon";
import { PrismaCouponRepository } from "@modules/coupon/infrastructure/repository/PrismaCouponRepository";

export const makeCreateCouponFactory = () => {
  const repository = new PrismaCouponRepository();
  return new CreateCouponUseCase(repository
    
  );
};
