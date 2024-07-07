import { CouponRepository } from "@modules/coupon/application/repository/CouponRepository";
import { DetailCouponUseCase } from "@modules/coupon/application/useCases/DetailCoupon";
import { beforeEach, describe, expect, it } from "bun:test";
import { MockCouponRepository } from "../../mocks/repository/MockCouponRepository";
import { faker } from "@faker-js/faker";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";

describe("DetailCoupon", () => {
  let useCase: DetailCouponUseCase;
  let repository: CouponRepository;
  let couponId: string;

  beforeEach(() => {
    repository = new MockCouponRepository();
    useCase = new DetailCouponUseCase(repository);

    couponId = faker.string.uuid();
    repository.save(
      new Coupon({
        id: couponId,
        code: "COUPON_CODE",
        ownerId: faker.string.uuid(),
        discount: {
          type: "PERCENTAGE",
          value: 10,
        },
        availability: {
          type: "UNLIMITED",
        },
      })
    );
  });

  it("should return coupon", async () => {
    const coupon = await useCase.execute({ couponId });

    expect(coupon).toEqual(
      expect.objectContaining({ id: couponId, code: "COUPON_CODE" })
    );
  });

  it("should throw if coupon not found", async () => {
    await expect(
      useCase.execute({ couponId: faker.string.uuid() })
    ).rejects.toThrow("Coupon not found");
  });
});
