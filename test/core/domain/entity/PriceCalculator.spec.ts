import { describe, expect, it } from "bun:test";
import { PriceCalculator } from "@core/domain/entity/PriceCalculator";

describe("PriceCalculator", () => {
  it("should calculate the total price of a cart", () => {
    const items = [
      { price: 10, quantity: 1, itemId: "1" },
      { price: 20, quantity: 2, itemId: "2" },
    ];

    const result = PriceCalculator.calculate(items);

    expect(result.items).toEqual([
      { price: 10, quantity: 1, itemId: "1", priceWithDiscount: null },
      { price: 20, quantity: 2, itemId: "2", priceWithDiscount: null },
    ]);
    expect(result.totals.items).toBe(50);
    expect(result.totals.discount).toBe(0);
    expect(result.totals.amount).toBe(50);
    expect(result.totals.taxes).toBe(0);
  });

  it("should calculate the total price of a cart with a coupon", () => {
    const items = [
      { price: 10, quantity: 1, itemId: "1" },
      { price: 20, quantity: 2, itemId: "2" },
    ];
    const coupon = {
      code: "COUPON",
      discount: { type: "PERCENTAGE" as const, value: 10 },
      enforceInTickets: [],
    };

    const result = PriceCalculator.calculate(items, coupon);

    expect(result.items).toEqual([
      { price: 10, quantity: 1, itemId: "1", priceWithDiscount: 9 },
      { price: 20, quantity: 2, itemId: "2", priceWithDiscount: 18 },
    ]);
    expect(result.totals.items).toBe(50);
    expect(result.totals.discount).toBe(5);
    expect(result.totals.amount).toBe(45);
    expect(result.totals.taxes).toBe(0);
  });

  it("should calculate the total price of a cart with a coupon that applies only to specific items", () => {
    const items = [
      { price: 10, quantity: 1, itemId: "1" },
      { price: 20, quantity: 2, itemId: "2" },
    ];
    const coupon = {
      code: "COUPON",
      discount: { type: "PERCENTAGE" as const, value: 10 },
      enforceInTickets: ["2"],
    };

    const result = PriceCalculator.calculate(items, coupon);

    expect(result.totals.items).toBe(50);
    expect(result.totals.discount).toBe(4);
    expect(result.totals.amount).toBe(46);
    expect(result.totals.taxes).toBe(0);
  });
});
