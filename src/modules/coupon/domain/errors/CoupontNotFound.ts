import { BaseError } from "@core/domain/errors/BaseError";



export class CouponNotFoundError extends BaseError {
  constructor() {
    super("Coupon not found");
    this.name = "CouponNotFoundError";
  }
}