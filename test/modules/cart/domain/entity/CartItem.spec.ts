import { faker } from "@faker-js/faker";
import { CartItem } from "@modules/cart/domain/entity/valueObject/CarItem";
import {
  Ticket,
  TicketSaleStatus,
} from "@modules/tickets/domain/entity/Ticket";
import { beforeEach, describe, expect, it } from "bun:test";

describe("CartItem", () => {
  it("should create a valid cart item", () => {
    const cartItem = new CartItem({
      price: 100,
      quantity: 2,
      ticketId: faker.database.mongodbObjectId(),
    });

    expect(cartItem.price).toBe(100);
    expect(cartItem.quantity).toBe(2);
  });

  it("should calculate the total price of the cart item", () => {
    const cartItem = new CartItem({
      price: 100,
      quantity: 2,
      ticketId: faker.database.mongodbObjectId(),
    });

    expect(cartItem.total).toBe(200);
  });

  it("should throw an error if ticketId is not provided", () => {
    expect(
      () => new CartItem({ price: 100, quantity: 2, ticketId: "" })
    ).toThrowError();
  });

  it("should throw an error if price is less than 0", () => {
    expect(
      () =>
        new CartItem({
          price: -1,
          quantity: 2,
          ticketId: faker.database.mongodbObjectId(),
        })
    ).toThrowError();
  });

  it("should throw an error if quantity is less than 0", () => {
    expect(
      () =>
        new CartItem({
          price: 100,
          quantity: -1,
          ticketId: faker.database.mongodbObjectId(),
        })
    ).toThrowError();
  });

  it("should throw an error if quantity is 0", () => {
    expect(
      () =>
        new CartItem({
          price: 100,
          quantity: 0,
          ticketId: faker.database.mongodbObjectId(),
        })
    ).toThrowError();
  });

  it("should throw an error if quantity ticket greater than users length", () => {
    expect(
      () =>
        new CartItem({
          price: 100,
          quantity: 1,
          ticketId: faker.database.mongodbObjectId(),
          users: [
            { name: "John Doe", email: faker.internet.email() },
            { name: "Jane Doe", email: faker.internet.email() },
          ],
        })
    ).toThrowError();
  });

  describe("createMany", () => {
    let tickets: Ticket[];
    beforeEach(() => {
      tickets = [
        new Ticket({
          id: faker.database.mongodbObjectId(),
          name: faker.commerce.productName(),
          price: {
            price: 100,
          },
          ownerId: faker.database.mongodbObjectId(),
          stock: {
            type: "LIMITED",
            total: 3,
          },
        }),
        new Ticket({
          id: faker.database.mongodbObjectId(),
          name: faker.commerce.productName(),
          price: {
            price: 200,
          },
          ownerId: faker.database.mongodbObjectId(),
          stock: {
            type: "LIMITED",
            total: 3,
          },
        }),
      ];
    });
    it("should create many cart items", () => {
      const items = [
        {
          price: 100,
          quantity: 2,
          ticketId: tickets[0].id,
        },
        {
          price: 200,
          quantity: 1,
          ticketId: tickets[1].id,
        },
      ];

      const cartItems = CartItem.createMany(items, tickets);

      expect(cartItems.length).toBe(2);
      expect(cartItems[0].price).toBe(100);
      expect(cartItems[1].price).toBe(200);
    });

    it("should throw an error if ticket is not found", () => {
      const items = [
        {
          price: 100,
          quantity: 2,
          ticketId: faker.database.mongodbObjectId(),
        },
      ];

      expect(() => CartItem.createMany(items, tickets)).toThrowError();
    });

    it("should throw an error if ticket has no stock", () => {
      const items = [
        {
          price: 100,
          quantity: 4,
          ticketId: tickets[0].id,
        },
      ];

      expect(() => CartItem.createMany(items, tickets)).toThrowError();
    });

    it("should throw an error if ticket is not available", () => {
      const ticket = new Ticket({
        id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        price: {
          price: 100,
        },
        ownerId: faker.database.mongodbObjectId(),
        stock: {
          type: "LIMITED",
          total: 3,
        },
        saleStatus: TicketSaleStatus.SOLD_OUT,
      });
      const items = [
        {
          price: 100,
          quantity: 2,
          ticketId: ticket.id,
        },
      ];

      expect(() => CartItem.createMany(items, [ticket])).toThrowError();
    });
  });
});
