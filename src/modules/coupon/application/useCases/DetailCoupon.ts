import { CouponNotFoundError } from "@modules/coupon/domain/errors/CoupontNotFound";
import { CouponRepository } from "../repository/CouponRepository";

interface Input {
  couponId: string;
}

export class DetailCouponUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(input: Input) {
    const { couponId } = input;
    const coupon = await this.repository.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    return coupon.toJSON();
  }
}
