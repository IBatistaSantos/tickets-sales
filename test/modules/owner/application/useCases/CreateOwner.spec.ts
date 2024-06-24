import { describe, it, expect, beforeEach } from "bun:test";
import { CreateOwnerUseCase } from "../../../../../src/modules/owner/application/useCases/CreateOwner";
import { OwnerRepository } from "../../../../../src/modules/owner/application/repository/OwnerRepository";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";
import { OwnerAlreadyExists } from "../../../../../src/modules/owner/domain/errors/OwnerAlreadyExists";
import { MockOwnerRepository } from "../../mocks/repository/MockOwnerRepository";

describe("CreateOwnerUseCase", () => {
  let createOwnerUseCase: CreateOwnerUseCase;
  let repository: OwnerRepository;

  beforeEach(() => {
    repository = new MockOwnerRepository();
    createOwnerUseCase = new CreateOwnerUseCase(repository);
  });

  it("should create a new owner", async () => {
    const input = {
      name: "John Doe",
      organizerId: "org123",
    };

    const result = await createOwnerUseCase.execute(input);

    expect(result).toHaveProperty("id");
  });

  it("should throw an error if owner already exists", () => {
    const input = {
      name: "John Doe",
      organizerId: "org123",
    };

    repository.save(new Owner(input));
    expect(createOwnerUseCase.execute(input)).rejects.toThrow(
      OwnerAlreadyExists
    );
  });
});
