import { CartRepository } from "@modules/cart/application/repository/CartRepository";
import { CreateCartUseCase } from "@modules/cart/application/useCases/CreateCart";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { MockCartRepository } from "../../mocks/repository/MockCartRepositor";
import { OwnerNotFoundException } from "@modules/owner/domain/errors/OwnerNotFound";

describe("CreateCart", () => {
  let useCase: CreateCartUseCase;
  let repository: CartRepository;
  let input: any;

  beforeEach(() => {
    repository = new MockCartRepository();
    useCase = new CreateCartUseCase(repository);
    input = {
      ownerId: "ownerId",
      items: [
        {
          ticketId: "ticketId",
          quantity: 2,
          users: [],
        },
      ],
    };
  });

  it("should create a cart", async () => {
    const cart = await useCase.execute(input);

    expect(cart.ownerId).toBe(input.ownerId);
    expect(cart.items[0].quantity).toBe(input.items[0].quantity);
  });

  it("should throw an error if owner not found", async () => {
    spyOn(repository, "getOwnerId").mockResolvedValueOnce(null);
    expect(useCase.execute(input)).rejects.toThrowError(OwnerNotFoundException);
  });

  it("should throw an error if items is empty", async () => {
    input.items = [];
    expect(useCase.execute(input)).rejects.toThrowError();
  });
});
