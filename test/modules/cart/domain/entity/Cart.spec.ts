import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { ValidationError } from "@core/domain/errors/ValidationError";

describe("Cart", () => {
  it("should create a valid cart", () => {
    const props = {
      ownerId: faker.database.mongodbObjectId(),
      items: [
        {
          ticketId: faker.database.mongodbObjectId(),
          price: 2500,
          quantity: faker.number.int(),
          discount: 0,
          users: [],
        },
      ],
    };
    const cart = new Cart(props);

    const cartJson = cart.toJSON();

    expect(cart.ownerId).toBe(props.ownerId);
    expect(cartJson.items).toEqual(props.items);
  });

  it('should calculate the total amount of the cart', () => {
    const props = {
      ownerId: faker.database.mongodbObjectId(),
      items: [
        {
          ticketId: faker.database.mongodbObjectId(),
          price: 2500,
          quantity: 2,
          discount: 0,
          users: [],
        },
      ],
    };
    const cart = new Cart(props);

    expect(cart.total.amount).toBe(5000);
  })

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

  it("should throw an error if total is less than 0", () => {
    expect(
      () =>
        new Cart({
          ownerId: faker.database.mongodbObjectId(),
          items: [{
            price: -2500,
            quantity: faker.number.int(),
            ticketId: faker.database.mongodbObjectId(),
          }],
          total: { discount: 0, amount: -1 },
        })
    ).toThrowError(ValidationError);
  });

  it('should throw an error if discount is less than 0', () => {
    expect(() => new Cart({
      ownerId: faker.database.mongodbObjectId(),
      items: [{
        price: 2500,
        discount: -1,
        quantity: faker.number.int(),
        ticketId: faker.database.mongodbObjectId(),
      }],
      total: { discount: -1, amount: 0 },
    })).toThrowError(ValidationError);
  })
});
