import { Cart, CartStatus } from "@modules/cart/domain/entity/Cart";
import { CouponRepository } from "@modules/coupon/application/repository/CouponRepository";
import { Coupon } from "@modules/coupon/domain/entity/Coupon";
import {
  Ticket,
  TicketSaleStatus,
} from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";
import { PrismaClient, Status } from "@prisma/client";

export class PrismaCouponRepository implements CouponRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async getCartById(id: string): Promise<Cart | null> {
    const cart = await this.client.cart.findUnique({
      where: {
        id,
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            users: true,
          },
        },
        marketingData: true,
      },
    });

    if (!cart) return null;

    const marketingData = {
      utm_medium: cart.marketingData?.utmMedium || undefined,
      utm_source: cart.marketingData?.utmSource || undefined,
      utm_campaign: cart.marketingData?.utmCampaign || undefined,
      utm_content: cart.marketingData?.utmContent || undefined,
    };

    return new Cart({
      id: cart.id,
      ownerId: cart.ownerId,
      status: cart.status as any,
      createdAt: cart.createdAt,
      statusCart: cart.statusCart as CartStatus,
      updatedAt: cart.updatedAt,
      couponId: cart.couponId || undefined,
      ...(cart.customerEmail && {
        customer: {
          email: cart.customerEmail as any,
          name: cart.customerName as any,
        },
      }),
      items: cart.items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        users: item.users.map((user) => ({
          name: user.name,
          email: user.email,
          infoExtra: (user.infoExtra as any) || null,
        })),
      })),
      ...(cart.customerEmail &&
        cart.customerName && {
          customer: {
            email: cart.customerEmail,
            name: cart.customerName,
          },
        }),
      marketingData,
    });
  }

  async applyCouponInCart(cart: Cart): Promise<void> {
    await this.client.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        couponId: cart.couponId,
      },
    });
  }

  async findById(id: string): Promise<Coupon | null> {
    const coupon = await this.client.coupon.findFirst({
      where: {
        id,
        status: "ACTIVE",
      },
    });

    if (!coupon) return null;

    return new Coupon({
      code: coupon.code,
      availability: {
        type: coupon.availabilityType,
        quantity: coupon.availabilityQty || undefined,
        total: coupon.availabilityTotal || undefined,
      },
      discount: {
        type: coupon.discountType,
        value: coupon.discountValue,
      },
      ownerId: coupon.ownerId,
      createdAt: coupon.createdAt,
      description: coupon.description || "",
      enforceInTickets: coupon.enforceInTickets,
      id: coupon.id,
      statusCoupon: coupon.statusCoupon,
      status: coupon.status,
      updatedAt: coupon.updatedAt,
      usedQuantity: coupon.usedQuantity,
    });
  }

  async findByCode(code: string, ownerId: string): Promise<Coupon | null> {
    const coupon = await this.client.coupon.findFirst({
      where: {
        code,
        ownerId,
        status: "ACTIVE",
      },
    });

    if (!coupon) return null;

    return new Coupon({
      code: coupon.code,
      availability: {
        type: coupon.availabilityType,
        quantity: coupon.availabilityQty || undefined,
        total: coupon.availabilityTotal || undefined,
      },
      discount: {
        type: coupon.discountType,
        value: coupon.discountValue,
      },
      ownerId: coupon.ownerId,
      createdAt: coupon.createdAt,
      description: coupon.description || "",
      enforceInTickets: coupon.enforceInTickets,
      id: coupon.id,
      statusCoupon: coupon.statusCoupon,
      status: coupon.status,
      updatedAt: coupon.updatedAt,
      usedQuantity: coupon.usedQuantity,
    });
  }

  async listByOwnerId(ownerId: string): Promise<Coupon[]> {
    const coupons = await this.client.coupon.findMany({
      where: {
        ownerId,
        status: "ACTIVE",
      },
    });

    if (!coupons || !coupons.length) return [];

    return coupons.map(
      (coupon) =>
        new Coupon({
          code: coupon.code,
          availability: {
            type: coupon.availabilityType,
            quantity: coupon.availabilityQty || undefined,
            total: coupon.availabilityTotal || undefined,
          },
          discount: {
            type: coupon.discountType,
            value: coupon.discountValue,
          },
          ownerId: coupon.ownerId,
          createdAt: coupon.createdAt,
          description: coupon.description || "",
          enforceInTickets: coupon.enforceInTickets,
          id: coupon.id,
          statusCoupon: coupon.statusCoupon,
          status: coupon.status,
          updatedAt: coupon.updatedAt,
          usedQuantity: coupon.usedQuantity,
        })
    );
  }

  async listTicketByIds(ids: string[], ownerId: string): Promise<Ticket[]> {
    const tickets = await this.client.ticket.findMany({
      where: {
        id: {
          in: ids,
        },
        ownerId,
        status: "ACTIVE",
      },
    });

    if (!tickets || !tickets.length) return [];

    return tickets.map(
      (ticket) =>
        new Ticket({
          id: ticket.id,
          name: ticket.name,
          description: ticket.description || "",
          accessType: ticket.accessType,
          categoryId: ticket.categoryId || undefined,
          usedQuantity: ticket.usedQuantity,
          hidden: ticket.hidden,
          status: ticket.status,
          saleStatus: ticket.saleStatus as TicketSaleStatus,
          position: ticket.position,
          stock: {
            type: ticket.stockType,
            available: ticket.stockAvailable,
            total: ticket.stockTotal,
          },
          price: {
            price: ticket.priceValue,
            currency: ticket.currency as Currency,
          },
          ownerId: ticket.ownerId,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        })
    );
  }

  async save(coupon: Coupon): Promise<void> {
    const {
      code,
      ownerId,
      description,
      discount,
      availability,
      enforceInTickets,
    } = coupon;
    await this.client.coupon.create({
      data: {
        code,
        ownerId,
        description,
        createdAt: coupon.createdAt,
        id: coupon.id,
        statusCoupon: coupon.statusCoupon,
        status: coupon.status as Status,
        updatedAt: coupon.updatedAt,
        discountType: discount.type,
        usedQuantity: coupon.usedQuantity,
        discountValue: discount.value,
        availabilityType: availability.type,
        availabilityQty: availability.quantity || undefined,
        availabilityTotal: availability.total || undefined,
        enforceInTickets,
      },
    });
  }
}
