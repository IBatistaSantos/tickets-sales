import { CartNotFoundException } from "@modules/cart/domain/errors/CartNotFoundException";
import { CouponRepository } from "../repository/CouponRepository";
import { CouponNotFoundError } from "@modules/coupon/domain/errors/CoupontNotFound";
import { TicketNotFoundException } from "@modules/tickets/domain/errors/TicketNotFoundException";
import {
  PriceCalculator,
  PriceItemResponse,
} from "@core/domain/entity/PriceCalculator";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { CartUser } from "@modules/cart/domain/entity/valueObject/CarItem";

interface Input {
  code: string;
  cartId: string;
}

export class ApplyCouponUseCase {
  constructor(private repository: CouponRepository) {}

  async execute(input: Input) {
    const { cartId, code } = input;

    const cart = await this.getCartById(cartId);
    const coupon = await this.getCouponByCode(code, cart.ownerId);

    coupon.canUsed();

    const itemsWithPrices = await this.buildCartItems(cart);
    const { items, totals } = PriceCalculator.calculate(
      itemsWithPrices,
      coupon
    );

    cart.addCoupon(coupon.id);
    await this.repository.applyCouponInCart(cart);

    const itemsWithUsers = this.attachUsersToItems(items, cart);

    return {
      ...cart.toJSON(),
      items: itemsWithUsers,
      total: totals.amount,
    };
  }

  private async getCartById(cartId: string): Promise<Cart> {
    const cart = await this.repository.getCartById(cartId);
    if (!cart) throw new CartNotFoundException();
    return cart;
  }

  private async getCouponByCode(code: string, ownerId: string) {
    const coupon = await this.repository.findByCode(code, ownerId);
    if (!coupon) throw new CouponNotFoundError();
    return coupon;
  }

  private async buildCartItems(cart: Cart) {
    const cartItems = cart.items.map((item) => item.toJSON());
    const itemIds = cartItems.map((item) => item.itemId);

    const tickets = await this.repository.listTicketByIds(
      itemIds,
      cart.ownerId
    );
    const ticketMap = new Map(tickets.map((ticket) => [ticket.id, ticket]));

    return cartItems.map((item) => {
      const ticket = ticketMap.get(item.itemId);
      if (!ticket) throw new TicketNotFoundException();

      return {
        quantity: item.quantity,
        itemId: ticket.id,
        price: ticket.price.price,
      };
    });
  }

  private attachUsersToItems(items: PriceItemResponse[], cart: Cart) {
    const itemUserMap = new Map<string, CartUser[]>();

    cart.items.forEach((cartItem) => {
      itemUserMap.set(cartItem.itemId, cartItem.users);
    });

    return items.map((item) => ({
      ...item,
      users: itemUserMap.get(item.itemId) || [],
    }));
  }
}
