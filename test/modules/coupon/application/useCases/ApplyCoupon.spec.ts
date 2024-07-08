import { CouponRepository } from "@modules/coupon/application/repository/CouponRepository";
import { ApplyCouponUseCase } from "@modules/coupon/application/useCases/ApplyCoupon";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { MockCouponRepository } from "../../mocks/repository/MockCouponRepository";
import { faker } from "@faker-js/faker";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";

describe("ApplyCoupon", () => {
  let useCase: ApplyCouponUseCase;
  let repository: CouponRepository;

  beforeEach(() => {
    repository = new MockCouponRepository();
    useCase = new ApplyCouponUseCase(repository);

    repository.save(
      new Coupon({
        code: "COUPON",
        ownerId: "OWNER_ID",
        discount: {
          type: "INTEGER",
          value: 10,
        },
        availability: {
          type: "UNLIMITED",
        },
      })
    );
  });

  it("should apply a coupon in a cart", async () => {
    const response = await useCase.execute({
      cartId: faker.string.uuid(),
      code: "COUPON",
    });

    expect(response.total).toBe(90);
    expect(response.items).toHaveLength(1);
    expect(response.items).toEqual([
      {
        itemId: "1",
        quantity: 1,
        price: 100,
        users: [
          {
            email: expect.any(String),
            name: expect.any(String),
          },
        ],
        priceWithDiscount: 90,
      },
    ]);
  });

  it("should throw an error when the cart is not found", async () => {
    spyOn(repository, "getCartById").mockImplementationOnce(() =>
      Promise.resolve(null)
    );

    await expect(
      useCase.execute({
        cartId: faker.string.uuid(),
        code: "COUPON",
      })
    ).rejects.toThrowError("Cart not found");
  });

  it("should throw an error when the coupon is not found", async () => {
    await expect(
      useCase.execute({
        cartId: faker.string.uuid(),
        code: "INVALID_COUPON",
      })
    ).rejects.toThrowError("Coupon not found");
  });

  it("should throw an error when the coupon is not available", async () => {
    repository.save(
      new Coupon({
        code: "COUPON_NOT_AVAILABLE",
        ownerId: "OWNER_ID",
        statusCoupon: "PAUSED",
        discount: {
          type: "PERCENTAGE",
          value: 10,
        },
        availability: {
          type: "LIMITED",
          total: 1,
        },
      })
    );

    await expect(
      useCase.execute({
        cartId: faker.string.uuid(),
        code: "COUPON_NOT_AVAILABLE",
      })
    ).rejects.toThrowError("Coupon is not available");
  });
});
