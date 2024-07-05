import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { CouponAlreadyExists } from "@modules/coupon/domain/errors/CouponAlreadyExists";
import { CouponRepository } from "../repository/CouponRepository";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { DiscountCouponProps } from "@modules/coupon/domain/valueObject/DiscountCoupon";
import { AvailabilityCouponProps } from "@modules/coupon/domain/valueObject/AvailabilityCoupon";

interface Input {
  code: string;
  ownerId: string;
  description?: string;
  discount: DiscountCouponProps;
  availability:AvailabilityCouponProps;
  enforceInTickets?: string[];
}

export class CreateCouponUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(input: Input) {
    const { ownerId, code, enforceInTickets } = input;
    const couponAlreadyExists = await this.repository.findByCode(code, ownerId);

    if (couponAlreadyExists) {
      throw new CouponAlreadyExists(code);
    }

    if (enforceInTickets && enforceInTickets.length) {
      const tickets = await this.repository.listTicketByIds(enforceInTickets, ownerId);

      if (tickets.length !== enforceInTickets.length) {
        throw new ValidationError("Invalid tickets");
      }
    }

    const coupon = new Coupon(input);

    await this.repository.save(coupon);

    return coupon.toJSON();
  }
}
