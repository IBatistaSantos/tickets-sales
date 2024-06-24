import { describe, expect, it } from "bun:test";
import { BaseEntity } from "../../../../src/core/domain/entity/BaseEntity";

describe("BaseEntity", () => {
  it("should create a new BaseEntity", () => {
    const baseEntity = new BaseEntity({});
    expect(baseEntity).toBeInstanceOf(BaseEntity);
    expect(baseEntity.id).toBeDefined();
  });

  it("should create a new BaseEntity with the given id", () => {
    const id = "123";
    const baseEntity = new BaseEntity({ id });
    expect(baseEntity.id).toBe(id);
  });

  it("should return the JSON representation of the BaseEntity", () => {
    const baseEntity = new BaseEntity({ id: "123" });
    const json = baseEntity.toJSON();
    expect(json).toEqual({
      id: "123",
      createdAt: baseEntity.createdAt,
      updatedAt: baseEntity.updatedAt,
      status: baseEntity.status,
    });
  });
});
