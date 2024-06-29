import { faker } from "@faker-js/faker";
import { describe, expect, it } from "bun:test";
import { Email } from "@core/domain/entity/Email";

describe("Email", () => {
  it("should create a valid email", () => {
    expect(new Email(faker.internet.email()).value).toBeTruthy();
  });

  it("should create a valid email with uppercase", () => {
    const email = new Email("ANY@ANY.COM.BR");
    expect(email.value).toBe("any@any.com.br");
  });

  it("should create a valid email with spaces", () => {
    const email = new Email(" any@any.com.br  ");
    expect(email.value).toBe("any@any.com.br");
  });

  it("should throw an error when email is invalid", () => {
    expect(() => new Email(faker.string.binary())).toThrowError(
      "Invalid email"
    );
  });

  it("should throw an error when email is empty", () => {
    expect(() => new Email("")).toThrowError("Email is required");
  });
});
