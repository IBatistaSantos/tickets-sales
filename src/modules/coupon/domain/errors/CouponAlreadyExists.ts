import { BaseError } from "@core/domain/errors/BaseError";

export class CouponAlreadyExists extends BaseError {
  constructor(code: string) {
    super(`Coupon with code ${code} already exists`);
    this.name = "CouponAlreadyExists";
  }
}
