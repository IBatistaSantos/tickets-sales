import { faker } from "@faker-js/faker";
import { OrderCustomer } from "@modules/orders/domain/entity/valueObject/Customer";
import { describe, expect, it } from "bun:test";

describe("OrderCustomer", () => {
  it("should create a customer", () => {
    const customer = new OrderCustomer({
      document: "12345678909",
      documentType: "cpf",
      phone: "123456789",
      email: faker.internet.email(),
      name: faker.person.fullName(),
    });

    expect(customer).toBeInstanceOf(OrderCustomer);
  });

  it("should throw an error when document is invalid", () => {
    expect(() => {
      new OrderCustomer({
        document: "",
        documentType: "cpf",
        phone: "123456789",
        email: faker.internet.email(),
        name: faker.person.fullName(),
      });
    }).toThrowError("Document is required");
  });

  it("should throw an error when email is invalid", () => {
    expect(() => {
      new OrderCustomer({
        document: "12345678909",
        documentType: "cpf",
        phone: "123456789",
        email: "",
        name: faker.person.fullName(),
      });
    }).toThrowError("Email is required");
  });

  it("should throw an error when name is invalid", () => {
    expect(() => {
      new OrderCustomer({
        document: "12345678909",
        documentType: "cpf",
        phone: "123456789",
        email: faker.internet.email(),
        name: "",
      });
    }).toThrowError("Name is required");
  });

  it("should throw an error when document type is invalid", () => {
    expect(() => {
      new OrderCustomer({
        document: "12345678909",
        documentType: "invalid",
        phone: "123456789",
        email: faker.internet.email(),
        name: faker.person.fullName(),
      });
    }).toThrowError("Invalid document type");
  });
});
