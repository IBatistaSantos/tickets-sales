import { ValidationError } from "../errors/ValidationError";

type CouponType = "PERCENTAGE" | "INTEGER";

interface Item {
  quantity: number;
  itemId: string;
  price: number;
}

interface Coupon {
  code: string;
  discount: {
    type: CouponType;
    value: number;
  };
  enforceInTickets: string[];
}

export interface PriceItemResponse extends Item {
  priceWithDiscount?: number | null;
}
0;

interface PriceCalculateResponse {
  items: PriceItemResponse[];
  totals: {
    taxes: number;
    discount: number;
    items: number;
    amount: number;
  };
}

export class PriceCalculator {
  static calculate(items: Item[], coupon?: Coupon): PriceCalculateResponse {
    const totalItems = items.reduce((acc, item) => {
      const total = item.price * item.quantity;
      return acc + total;
    }, 0);
    const taxes = 0;

    const listItems = this.calculateItemPrice(items, coupon);
    const totalDiscount = this.calculateDiscount(listItems);

    const amount = totalItems - totalDiscount + taxes;

    return {
      items: listItems,
      totals: {
        taxes,
        discount: Number(Number(totalDiscount).toFixed(2)),
        items: Number(Number(totalItems).toFixed(2)),
        amount: Number(Number(amount).toFixed(2)),
      },
    };
  }

  private static calculateDiscount(listItems: PriceItemResponse[]): number {
    return listItems.reduce((acc, item) => {
      if (!item.priceWithDiscount) return acc;

      const diff = (item.price - item.priceWithDiscount) * item.quantity;

      return acc + diff;
    }, 0);
  }

  private static calculateItemPrice(items: Item[], coupon?: Coupon) {
    let priceWithDiscount: number | null = null;

    if (!coupon) {
      return items.map((item) => {
        return {
          ...item,
          priceWithDiscount,
        };
      });
    }

    return this.apply(items, coupon);
  }

  private static apply(items: Item[], coupon: Coupon) {
    const itemMap = new Map(items.map((item) => [item.itemId, item]));

    const specific = coupon.enforceInTickets.length;
    if (specific) {
      return this.applyDiscountSpecific(itemMap, coupon);
    }

    return items.map((item) => {
      const itemData = itemMap.get(item.itemId);

      if (!itemData) {
        throw new ValidationError("Item not found");
      }

      const discountType = coupon.discount.type;
      const price = itemData.price;

      if (discountType === "PERCENTAGE") {
        return {
          ...item,
          priceWithDiscount:
            price - this.applyDiscountByPercentage(price, coupon),
        };
      }

      return {
        ...item,
        priceWithDiscount: this.applyDiscountByValue(price, coupon),
      };
    });
  }

  private static applyDiscountSpecific(
    itemMap: Map<string, Item>,
    coupon: Coupon
  ) {
    const specific = new Set(coupon.enforceInTickets);
    const itemMapWithDiscount = new Map<
      string,
      Item & { priceWithDiscount?: number | null }
    >();

    itemMap.forEach((item, itemId) => {
      let priceWithDiscount: number | null = null;

      if (specific.has(itemId)) {
        const discountType = coupon.discount.type;
        const { price } = item;

        const discountValue =
          discountType === "PERCENTAGE"
            ? this.applyDiscountByPercentage(price, coupon)
            : this.applyDiscountByValue(price, coupon);

        priceWithDiscount = price - discountValue;
      }

      itemMapWithDiscount.set(itemId, {
        ...item,
        priceWithDiscount,
      });
    });

    return Array.from(itemMapWithDiscount.values());
  }

  private static applyDiscountByPercentage(price: number, coupon: Coupon) {
    const discountCouponValue = coupon.discount.value;
    return price * (discountCouponValue / 100);
  }

  private static applyDiscountByValue(price: number, coupon: Coupon) {
    const discountCouponValue = coupon.discount.value;
    return price - discountCouponValue;
  }
}
