import { faker } from "@faker-js/faker";
import { CouponRepository } from "@modules/coupon/application/repository/CouponRepository";
import { CreateCouponUseCase } from "@modules/coupon/application/useCases/CreateCoupon";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import { AvailabilityCouponProps } from "@modules/coupon/domain/valueObject/AvailabilityCoupon";
import { DiscountCouponProps } from "@modules/coupon/domain/valueObject/DiscountCoupon";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { MockCouponRepository } from "../../mocks/repository/MockCouponRepository";

describe("CreateCoupon", () => {
  let useCase: CreateCouponUseCase;
  let repository: CouponRepository;

  beforeEach(() => {
    repository = new MockCouponRepository();
    useCase = new CreateCouponUseCase(repository);
  });

  it("should create a coupon", async () => {
    const discount: DiscountCouponProps = {
      type: "PERCENTAGE",
      value: 10,
    };

    const availability: AvailabilityCouponProps = {
      type: "UNLIMITED",
    };

    const input = {
      code: "COUPON10",
      ownerId: "OWNER_ID",
      description: "Coupon 10",
      discount,
      availability,
    };

    const coupon = await useCase.execute(input);

    expect(coupon.code).toBe("COUPON10");
    expect(coupon.ownerId).toBe("OWNER_ID");
    expect(coupon.description).toBe("Coupon 10");
   /* expect(coupon.discount).toEqual({
      type: "PERCENTAGE",
      value: 10,
    });*/
    expect(coupon.availability).toEqual({
      type: "UNLIMITED",
    });
  });

  it("should throw an error when coupon already exists", async () => {
    spyOn(repository, "findByCode").mockResolvedValueOnce(
      new Coupon({
        availability: {
          type: "UNLIMITED",
        },
        code: "COUPON10",
        ownerId: faker.string.uuid(),
        discount: {
          type: "INTEGER",
          value: 10,
        },
      })
    );
    const discount: DiscountCouponProps = {
      type: "PERCENTAGE",
      value: 10,
    };

    const availability: AvailabilityCouponProps = {
      type: "UNLIMITED",
    };

    const input = {
      code: "COUPON10",
      ownerId: "OWNER_ID",
      description: "Coupon 10",
      discount,
      availability,
    };

    await expect(useCase.execute(input)).rejects.toThrowError(
      "Coupon with code COUPON10 already exists"
    );
  });

  it("should throw an error when ticket does not exist", async () => {
    spyOn(repository, "listTicketByIds").mockResolvedValueOnce([]);
    const discount: DiscountCouponProps = {
      type: "PERCENTAGE",
      value: 10,
    };

    const availability: AvailabilityCouponProps = {
      type: "UNLIMITED",
    };

    const input = {
      code: "COUPON10",
      ownerId: "OWNER_ID",
      description: "Coupon 10",
      discount,
      availability,
      enforceInTickets: ["TICKET_ID"],
    };

    await expect(useCase.execute(input)).rejects.toThrowError(
      "Invalid tickets"
    );
  });
});
