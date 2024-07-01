import { CartRepository } from "@modules/cart/application/repository/CartRepository";
import { UpdateCartUseCase } from "@modules/cart/application/useCases/UpdateCart";
import { beforeEach, describe, expect, it } from "bun:test";
import { MockCartRepository } from "../../mocks/repository/MockCartRepositor";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { faker } from "@faker-js/faker";

describe("UpdateCart", () => {
  let useCase: UpdateCartUseCase;
  let repository: CartRepository;
  let cart: Cart;
  let cartId: string;

  beforeEach(() => {
    repository = new MockCartRepository();
    useCase = new UpdateCartUseCase(repository);
    cartId = faker.database.mongodbObjectId();
    cart = new Cart({
      id: cartId,
      ownerId: faker.database.mongodbObjectId(),
      items: [
        {
          quantity: 1,
          itemId: faker.database.mongodbObjectId(),
        },
      ],
    });
    repository.save(cart);
  });

  it("should update a cart", async () => {
    const data = {
      items: [
        {
          itemId: "1",
          quantity: 1,
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
    };

    const result = await useCase.execute(cartId, data);

    expect(result.items.length).toBe(1);
    expect(result.items[0].quantity).toBe(1);
    expect(result.items[0].users.length).toBe(1);
    expect(result.items[0].users[0].email).toBe(data.items[0].users[0].email);
  });

  it("should throw an error when cart not found", async () => {
    const data = {
      items: [
        {
          itemId: "1",
          quantity: 1,
          users: [
            {
              email: faker.internet.email(),
              name: faker.person.fullName(),
            },
          ],
        },
      ],
    };

    await expect(
      useCase.execute(faker.database.mongodbObjectId(), data)
    ).rejects.toThrow();
  });
});
