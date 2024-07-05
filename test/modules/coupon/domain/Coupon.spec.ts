import { faker } from "@faker-js/faker";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { describe, expect, it } from "bun:test";


describe("Coupon", () => {
  it("should create a valid coupon", () => {
    const code = faker.string.uuid(); 
    const coupon = new Coupon({
      code,
      ownerId: faker.string.uuid(),
      availability: {
        type: "LIMITED",
        total: 10,
      },
      discount: {
        type: "PERCENTAGE",
        value: 10,
      },      
    })

    expect(coupon.code).toBe(code.toUpperCase());
    expect(coupon.ownerId).toBeDefined();
    expect(coupon.description).toBe("");
    expect(coupon.discount.type).toBe("PERCENTAGE");
  })

  it("should throw an error if code is missing", () => {
    expect(() => {
      new Coupon({
        code: "",
        ownerId: faker.string.uuid(),
        availability: {
          type: "LIMITED",
          total: 10,
        },
        discount: {
          type: "PERCENTAGE",
          value: 10,
        },      
      })
    }).toThrowError("Invalid coupon code");
  })

  it("should throw an error if ownerId is missing", () => {
    expect(() => {
      new Coupon({
        code: faker.string.uuid(),
        ownerId: "",
        availability: {
          type: "LIMITED",
          total: 10,
        },
        discount: {
          type: "PERCENTAGE",
          value: 10,
        },      
      })
    }).toThrowError("Invalid owner id");
  })
})