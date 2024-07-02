import { faker } from "@faker-js/faker";
import { CartItem } from "@modules/cart/domain/entity/valueObject/CarItem";
import { Order, OrderStatus } from "@modules/orders/domain/entity/Order";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";
import { describe, expect, it } from "bun:test";

describe("Order", () => {
  it("should create an order", () => {
    const order = Order.create({
      ownerId: faker.string.uuid(),
      cartId: faker.string.uuid(),
      billingAddress: {
        city: faker.location.city(),
        neighborhood: "Centro",
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      customer: {
        document: "12345678909",
        documentType: "cpf",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.string.uuid(),
      },
      items: [
        {
          itemId: faker.string.uuid(),
          price: 100,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
      payment: {
        method: "credit_card",
        gateway: "pagarme",
        gatewayId: faker.string.uuid(),
      },
    });

    expect(order).toBeInstanceOf(Order);
    expect(order.customer.toJSON()).toEqual({
      document: expect.any(String),
      documentType: "CPF",
      email: expect.any(String),
      name: expect.any(String),
      phone: expect.any(String),
    });
  });

  it("should calculate total", () => {
    const order = Order.create({
      ownerId: faker.string.uuid(),
      cartId: faker.string.uuid(),
      billingAddress: {
        city: faker.location.city(),
        neighborhood: "Centro",
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      customer: {
        document: "12345678909",
        documentType: "cpf",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.string.uuid(),
      },
      items: [
        {
          itemId: faker.string.uuid(),
          price: 100,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
        {
          itemId: faker.string.uuid(),
          price: 200,
          quantity: 2,
          name: "Product 2",
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
        },
      ],
      payment: {
        method: "credit_card",
        gateway: "pagarme",
        gatewayId: faker.string.uuid(),
      },
    });

    expect(order.total).toEqual({
      amount: 500,
      amountItems: 500,
      discount: 0,
      tax: 0,
    });
  });

  it("should return if order is free", () => {
    const order = Order.create({
      ownerId: faker.string.uuid(),
      cartId: faker.string.uuid(),
      billingAddress: {
        city: faker.location.city(),
        neighborhood: "Centro",
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      customer: {
        document: "12345678909",
        documentType: "cpf",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.string.uuid(),
      },
      items: [
        {
          itemId: faker.string.uuid(),
          price: 0,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
      payment: {
        method: "credit_card",
        gateway: "pagarme",
        gatewayId: faker.string.uuid(),
      },
    });

    expect(order.isFree).toBeTruthy();
  });

  it("should throw error if order is empty", () => {
    expect(() => {
      Order.create({
        ownerId: faker.string.uuid(),
        cartId: faker.string.uuid(),
        billingAddress: {
          city: faker.location.city(),
          neighborhood: "Centro",
          state: faker.location.state(),
          street: faker.location.street(),
          zipCode: faker.location.zipCode(),
        },
        customer: {
          document: "12345678909",
          documentType: "cpf",
          email: faker.internet.email(),
          name: faker.person.fullName(),
          phone: faker.string.uuid(),
        },
        items: [],
        payment: {
          method: "credit_card",
          gateway: "pagarme",
          gatewayId: faker.string.uuid(),
        },
      });
    }).toThrowError("Order must have at least one item");
  });

  it("should return payment free if order is free", () => {
    const order = Order.create({
      ownerId: faker.string.uuid(),
      cartId: faker.string.uuid(),
      billingAddress: {
        city: faker.location.city(),
        neighborhood: "Centro",
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      customer: {
        document: "12345678909",
        documentType: "cpf",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.string.uuid(),
      },
      items: [
        {
          itemId: faker.string.uuid(),
          price: 0,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
      payment: {
        method: "credit_card",
        gateway: "pagarme",
        gatewayId: faker.string.uuid(),
      },
    });

    expect(order.payment).toEqual({
      method: "free",
      gateway: "free",
      gatewayId: "free",
    });
  });

  it("should return status order paid if order is free", () => {
    const order =  Order.create({
      ownerId: faker.string.uuid(),
      cartId: faker.string.uuid(),
      billingAddress: {
        city: faker.location.city(),
        neighborhood: "Centro",
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      customer: {
        document: "12345678909",
        documentType: "cpf",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.string.uuid(),
      },
      items: [
        {
          itemId: faker.string.uuid(),
          price: 0,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
      payment: {
        method: "credit_card",
        gateway: "pagarme",
        gatewayId: faker.string.uuid(),
      },
    });

    expect(order.statusOrder).toBe(OrderStatus.PAID);
  });

  it("should throw error if order is free and has not payment", () => {
    expect(() => {
       Order.create({
        ownerId: faker.string.uuid(),
        cartId: faker.string.uuid(),
        billingAddress: {
          city: faker.location.city(),
          neighborhood: "Centro",
          state: faker.location.state(),
          street: faker.location.street(),
          zipCode: faker.location.zipCode(),
        },
        customer: {
          document: "12345678909",
          documentType: "cpf",
          email: faker.internet.email(), 
          name: faker.person.fullName(),
          phone: faker.string.uuid(),
        },
        items: [
          {
            itemId: faker.string.uuid(),
            price: 10,
            quantity: 1,
            name: "Product 1",
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          },
        ],
        payment: undefined,
      });
    }).toThrowError("Order must have a payment data");
  });

  describe("createItems", () => {
    it("should create items", () => {
      const cartItem: CartItem[] = [
        new CartItem({
          itemId: "1",
          quantity: 1,
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        }),
      ];
      const items = Order.createItems(
        cartItem,
        new Map([
          [
            "1",
            new Ticket({
              id: "1",
              name: "Product 1",
              price: {
                price: 100,
                currency: Currency.BRL,
              },
              ownerId: "1",
              stock: {
                type: "LIMITED",
                total: 2,
              },
            }),
          ],
        ])
      );

      expect(items).toEqual([
        {
          itemId: expect.any(String),
          price: 100,
          quantity: 1,
          name: "Product 1",
          users: [
            {
              email: expect.any(String),
              name: expect.any(String),
              infoExtra: undefined,
            },
          ],
        },
      ]);
    });

    it("should throw error if ticket not found", () => {
      expect(() => {
        const cartItem: CartItem[] = [
          new CartItem({
            itemId: "1",
            quantity: 1,
            users: [
              {
                email: faker.internet.email(),
                name: faker.person.fullName(),
              },
            ],
          }),
        ];
        Order.createItems(cartItem, new Map());
      }).toThrowError("Ticket with id 1 not found");
    });
  });
});
