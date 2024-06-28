import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CartRepository } from "../repository/CartRepository";

export class FindCartUseCase {
  constructor(private repository: CartRepository) {}

  async execute(cartId: string) {
    const cart = await this.repository.findById(cartId);
    if (!cart) throw new CartNotFoundException();

    return cart.toJSON();
  }
}
