import { fa, faker } from "@faker-js/faker";
import { OrderItem } from "@modules/orders/domain/entity/valueObject/OrderItem";
import { describe, expect, it } from "bun:test";

describe("OrderItem", () => {
  it("should create an order item", () => {
    const orderItem = new OrderItem({
      name: "Product 1",
      price: 100,
      quantity: 1,
      users: [
        {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      ],
    });

    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.toJSON()).toEqual({
      name: "Product 1",
      price: 100,
      quantity: 1,
      users: [
        {
          email: expect.any(String),
          name: expect.any(String),
        },
      ],
    });
  });

  it("should throw an error if name is not provided", () => {
    expect(() => {
      new OrderItem({
        name: "",
        price: 100,
        quantity: 1,
        users: [
          {
            email: faker.internet.email(),
            name: faker.person.fullName(),
          },
        ],
      });
    }).toThrowError("Name is required");
  });

  it("should throw an error if quantity is not provided", () => {
    expect(() => {
      new OrderItem({
        name: "Product 1",
        price: 100,
        quantity: 0,
        users: [
          {
            email: faker.internet.email(),
            name: faker.person.fullName(),
          },
        ],
      });
    }).toThrowError("Quantity is required");
  });

  it("should throw an error if price is not greater than 0", () => {
    expect(() => {
      new OrderItem({
        name: "Product 1",
        price: -1,
        quantity: 1,
        users: [
          {
            email: faker.internet.email(),
            name: faker.person.fullName(),
          },
        ],
      });
    }).toThrowError("Price must be greater than 0");
  });

  it("should throw an error if users is not provided", () => {
    expect(() => {
      new OrderItem({
        name: "Product 1",
        price: 100,
        quantity: 1,
        users: [],
      });
    }).toThrowError("Users is required");
  });

  it("should throw an error if users length different quantity ticket", () => {
    expect(() => {
      new OrderItem({
        name: "Product 1",
        price: 100,
        quantity: 1,
        users: [
          {
            email: faker.internet.email(),
            name: faker.person.fullName(),
          },
          {
            email: faker.internet.email(),
            name: faker.person.fullName(),
          },
        ],
      });
    }).toThrowError("Users length different quantity ticket");
  });
});
