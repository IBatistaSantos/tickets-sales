import { AvailabilityCoupon } from "@modules/coupon/domain/valueObject/AvailabilityCoupon";
import { describe, expect, it } from "bun:test";

describe("AvailabilityCoupon", () => {
  it("should create a valid availability coupon", () => {
    const availabilityCoupon = new AvailabilityCoupon({
      type: "LIMITED",
      total: 10,
    });

    expect(availabilityCoupon.type).toBe("LIMITED");
    expect(availabilityCoupon.total).toBe(10);
    expect(availabilityCoupon.quantity).toBe(10);
  });

  it("should create a valid availability coupon with quantity", () => {
    const availabilityCoupon = new AvailabilityCoupon({
      type: "LIMITED",
      total: 10,
      quantity: 5,
    });

    expect(availabilityCoupon.type).toBe("LIMITED");
    expect(availabilityCoupon.total).toBe(10);
    expect(availabilityCoupon.quantity).toBe(5);
  });

  it("should create a valid availability coupon with unlimited availability", () => {
    const availabilityCoupon = new AvailabilityCoupon({
      type: "UNLIMITED",
    });

    expect(availabilityCoupon.type).toBe("UNLIMITED");
    expect(availabilityCoupon.total).toBeUndefined();
    expect(availabilityCoupon.quantity).toBeUndefined();
  });

  it("should throw an error if type is invalid", () => {
    expect(() => {
      new AvailabilityCoupon({
        type: "INVALID" as any,
      });
    }).toThrowError("Invalid availability type");
  });

  it("should throw an error if total is missing", () => {
    expect(() => {
      new AvailabilityCoupon({
        type: "LIMITED",
      });
    }).toThrowError("Invalid availability total or quantity");
  });
});
