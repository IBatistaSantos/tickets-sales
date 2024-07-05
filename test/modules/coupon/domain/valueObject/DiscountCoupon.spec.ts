import { DiscountCoupon } from "@modules/coupon/domain/valueObject/DiscountCoupon";
import { describe, expect, it } from "bun:test";

describe("DiscountCoupon", () => {
  it("should create a valid DiscountCoupon", () => {
    const discountCoupon = new DiscountCoupon({
      type: "PERCENTAGE",
      value: 10,
    });

    expect(discountCoupon.type).toBe("PERCENTAGE");
    expect(discountCoupon.value).toBe(10);
  });

  it("should throw an error if type is invalid", () => {
    expect(() => {
      new DiscountCoupon({
        type: "INVALID" as any,
        value: 10,
      });
    }).toThrowError("Invalid discount type");
  });

  it("should throw an error if value is invalid", () => {
    expect(() => {
      new DiscountCoupon({
        type: "PERCENTAGE",
        value: -10,
      });
    }).toThrowError("Invalid value for percentage discount");
  });

  it("should throw an error if value is invalid", () => {
    expect(() => {
      new DiscountCoupon({
        type: "INTEGER",
        value: -10,
      });
    }).toThrowError("Invalid value for integer discount");
  });
});
