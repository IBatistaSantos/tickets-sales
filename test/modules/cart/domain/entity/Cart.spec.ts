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
        ]
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
});
