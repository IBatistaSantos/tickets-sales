

export class CouponAlreadyExists extends Error {
  constructor(code: string) {
    super(`Coupon with code ${code} already exists`);
    this.name = "CouponAlreadyExists";
  }
}