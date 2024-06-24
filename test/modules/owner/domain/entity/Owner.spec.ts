import { describe, expect, it } from "bun:test";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";

describe("Owner", () => {
  it("should create a new Owner", () => {
    const owner = new Owner({
      name: "John Doe",
      organizerId: "123",
    });

    expect(owner).toBeInstanceOf(Owner);
    expect(owner.id).toBeDefined();
    expect(owner.name).toBe("John Doe");
  });

  it("should return the JSON representation of the Owner", () => {
    const owner = new Owner({
      name: "John Doe",
      organizerId: "123",
    });

    const json = owner.toJSON();
    expect(json).toEqual({
      id: owner.id,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
      status: owner.status,
      name: owner.name,
      organizerId: owner.organizerId,
    });
  });

  it("should throw an error if name is not provided", () => {
    expect(() => new Owner({} as any)).toThrowError("Name is required");
  });

  it("should throw an error if organizerId is not provided", () => {
    expect(() => new Owner({ name: "John Doe" } as any)).toThrowError(
      "OrganizerId is required"
    );
  });
});
