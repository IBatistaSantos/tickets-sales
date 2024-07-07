import { CouponRepository } from "../repository/CouponRepository";

interface Input {
  ownerId: string;
}

export class ListCouponUseCase {
  constructor(private repository: CouponRepository) {}

  async execute(input: Input) {
    const listCoupon = await this.repository.listByOwnerId(input.ownerId);

    return listCoupon.map((coupon) => {
      return coupon.toJSON();
    });
  }
}
