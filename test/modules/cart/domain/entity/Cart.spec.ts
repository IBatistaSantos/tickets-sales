import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { Cart, CartStatus } from "@modules/cart/domain/entity/Cart";
import { ValidationError } from "@core/domain/errors/ValidationError";

describe("Cart", () => {
  it("should create a valid cart", () => {
    const props = {
      ownerId: faker.database.mongodbObjectId(),
      items: [
        {
          itemId: faker.database.mongodbObjectId(),
          quantity: faker.number.int(),
          users: [],
        },
      ],
    };
    const cart = new Cart(props);

    const cartJson = cart.toJSON();

    expect(cart.ownerId).toBe(props.ownerId);
    expect(cartJson.items).toEqual(props.items);
  });

  it("should throw an error if ownerId is not provided", () => {
    expect(() => new Cart({ items: [], ownerId: "" })).toThrowError(
      ValidationError
    );
  });

  it("should throw an error if items is empty", () => {
    expect(() => new Cart({ ownerId: "", items: [] })).toThrowError(
      ValidationError
    );
  });

  describe("checkOut", () => {
    it("should change status to checked-out", () => {
      const cart = new Cart({
        ownerId: faker.database.mongodbObjectId(),
        customer: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
        items: [
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
      });

      cart.checkout();

      expect(cart.statusCart).toBe(CartStatus.CHECKED_OUT);
    });

    it("should throw an error if cart is already checked-out", () => {
      const cart = new Cart({
        ownerId: faker.database.mongodbObjectId(),
        customer: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
        items: [
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
        statusCart: CartStatus.CHECKED_OUT,
      });

      expect(() => cart.checkout()).toThrowError(ValidationError);
    });
  });

  describe("calculateTotal", () => {
    it("should calculate total", () => {
      const cart = new Cart({
        ownerId: faker.database.mongodbObjectId(),
        customer: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
        items: [
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
      });

      const listPrices = [
        {
          id: cart.items[0].itemId,
          price: 100,
        },
      ];

      const total = cart.calculateTotal(listPrices);

      expect(total.totals.amount).toBe(100);
    });

    it("should calculate total with discount", () => {
      const cart = new Cart({
        ownerId: faker.database.mongodbObjectId(),
        customer: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
        items: [
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
      });

      const listPrices = [
        {
          id: cart.items[0].itemId,
          price: 100,
        },
      ];

      const coupon = {
        code: "COUPON",
        discount: { type: "PERCENTAGE" as any, value: 10 },
        enforceInTickets: [],
      };

      const total = cart.calculateTotal(listPrices, coupon);

      expect(total.totals.amount).toBe(90);
      expect(total.totals.discount).toBe(10);
      expect(total.totals.items).toBe(100);
    });

    it("should calculate total with discount only in specific items", () => {
      const cart = new Cart({
        ownerId: faker.database.mongodbObjectId(),
        customer: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
        items: [
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
          {
            quantity: 1,
            itemId: faker.string.uuid(),
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
      });

      const listPrices = [
        {
          id: cart.items[0].itemId,
          price: 100,
        },
        {
          id: cart.items[1].itemId,
          price: 100,
        },
      ];

      const coupon = {
        code: "COUPON",
        discount: { type: "PERCENTAGE" as any, value: 10 },
        enforceInTickets: [cart.items[0].itemId],
      };

      const total = cart.calculateTotal(listPrices, coupon);

      expect(total.totals.amount).toBe(190);
      expect(total.totals.discount).toBe(10);
      expect(total.totals.items).toBe(200);
    });
  });
});
