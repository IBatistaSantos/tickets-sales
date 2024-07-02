import { AccessType, PrismaClient, Status } from "@prisma/client";
import { randomUUID } from "crypto";
import { OrderRepository } from "@modules/orders/application/repository/OrderRepository";
import { Cart, CartStatus } from "@modules/cart/domain/entity/Cart";
import { Order } from "@modules/orders/domain/entity/Order";
import {
  Ticket,
  TicketSaleStatus,
} from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";

export class PrismaOrderRepository implements OrderRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async save(order: Order, transaction: PrismaClient): Promise<void> {
    const customer = await transaction.customer.create({
      data: {
        name: order.customer.name,
        email: order.customer.email,
        document: order.customer.document,
        documentType: order.customer.documentType,
        phone: order.customer.phone,
      },
    });

    const orderDb = await transaction.order.create({
      data: {
        ownerId: order.ownerId,
        cartId: order.cartId,
        createdAt: order.createdAt,
        customerId: customer.id,
        total_amount: order.total.amount,
        total_discount: order.total.discount,
        total_items: order.total.amountItems,
        total_tax: order.total.tax,
        status: order.status as Status,
        updatedAt: order.updatedAt,
        billingAddress: {
          create: {
            street: order.billingAddress.street,
            number: order.billingAddress.number || "",
            complement: order.billingAddress.complement || "",
            neighborhood: order.billingAddress.neighborhood,
            city: order.billingAddress.city,
            state: order.billingAddress.state,
            zipCode: order.billingAddress.zipCode,
          },
        },
        id: order.id,
      },
    });

    for (const item of order.items) {
      const itemDb = await transaction.orderItem.create({
        data: {
          name: item.name,
          quantity: item.quantity,
          itemId: item.itemId,
          orderId: orderDb.id,
          price: item.price,
        },
      });

      for (const user of item.users) {
        await transaction.orderItemUser.create({
          data: {
            name: user.name,
            email: user.email,
            infoExtra: JSON.stringify(user.infoExtra) || "",
            orderItemId: itemDb.id,
          },
        });
      }
    }
  }

  async updateCart(cart: Cart, transaction: PrismaClient): Promise<void> {
    const cartDb = await transaction.cart.findFirstOrThrow({
      where: {
        id: cart.id,
        status: "ACTIVE",
      },
      include: {
        items: true,
        marketingData: true,
      },
    });

    if (!cartDb) throw new Error("Cart not found");

    for (const iterator of cartDb?.items) {
      await transaction.user.deleteMany({
        where: {
          itemId: iterator.id,
        },
      });
    }

    await transaction.cart.update({
      where: {
        id: cart.id,
        status: "ACTIVE",
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    await transaction.cart.update({
      where: {
        id: cart.id,
        status: "ACTIVE",
      },
      data: {
        status: cart.status as Status,
        updatedAt: cart.updatedAt,
        createdAt: cart.createdAt,
        statusCart: cart.statusCart as CartStatus,
        ...(cart.customer && {
          customerEmail: cart.customer.email,
          customerName: cart.customer.name,
        }),
        items: {
          create: cart.items.map((item) => ({
            id: randomUUID(),
            itemId: item.itemId,
            quantity: item.quantity,
            users: {
              create: item.users.map((user) => ({
                id: randomUUID(),
                name: user.name,
                email: user.email,
                infoExtra: JSON.stringify(user.infoExtra) || "",
              })),
            },
          })),
        },
        marketingData: {
          upsert: {
            create: {
              utmMedium:
                cart.marketingData.utmMedium || cart.marketingData.utm_medium,
              utmSource:
                cart.marketingData.utmSource || cart.marketingData.utm_source,
              utmCampaign:
                cart.marketingData.utmCampaign ||
                cart.marketingData.utm_campaign,
              utmContent:
                cart.marketingData.utmContent || cart.marketingData.utm_content,
            },
            update: {
              utmMedium:
                cart.marketingData.utmMedium || cart.marketingData.utm_medium,
              utmSource:
                cart.marketingData.utmSource || cart.marketingData.utm_source,
              utmCampaign:
                cart.marketingData.utmCampaign ||
                cart.marketingData.utm_campaign,
              utmContent:
                cart.marketingData.utmContent || cart.marketingData.utm_content,
            },
          },
        },
      },
    });
  }

  async updateTickets(
    tickets: Ticket[],
    transaction: PrismaClient
  ): Promise<void> {
    tickets.forEach(async (ticket) => {
      await transaction.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          name: ticket.name,
          description: ticket.description || "",
          price: {
            update: {
              price: ticket.price.price,
              currency: ticket.price.currency as Currency,
            },
          },
          stock: {
            update: {
              total: ticket.stock.total,
              type: ticket.stock.type,
              available: ticket.stock.available,
            },
          },
          updatedAt: ticket.updatedAt,
          status: ticket.status,
          createdAt: ticket.createdAt,
          saleStatus: ticket.saleStatus,
          accessType: ticket.accessType as AccessType,
          usedQuantity: ticket.usedQuantity,
          position: ticket.position,
          hidden: ticket.hidden,
          categoryId: ticket.categoryId || null,
        },
      });
    });
  }

  async getCart(cartId: string): Promise<Cart | null> {
    const cart = await this.client.cart.findUnique({
      where: {
        id: cartId,
        status: "ACTIVE",
      },
      include: {
        marketingData: true,
        items: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!cart) {
      return null;
    }

    return new Cart({
      id: cart.id,
      statusCart: cart.statusCart as CartStatus,
      ownerId: cart.ownerId,
      createdAt: cart.createdAt,
      customer: {
        email: cart.customerEmail as string,
        name: cart.customerName as string,
      },
      marketingData: {
        utmSource: cart.marketingData?.utmSource as string,
        utmMedium: cart.marketingData?.utmMedium as string,
        utmCampaign: cart.marketingData?.utmCampaign as string,
        utmContent: cart.marketingData?.utmContent as string,
      },
      status: cart.status,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        users: item.users.map((user) => ({
          name: user.name,
          email: user.email,
          infoExtra: user.infoExtra as Record<string, any>,
        })),
      })),
    });
  }

  async getTicketsByIds(ticketIds: string[]): Promise<Ticket[]> {
    const response = await this.client.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
        status: "ACTIVE",
      },
      include: {
        stock: true,
        price: true,
      },
    });

    if (!response || !response.length) {
      return [];
    }

    return response.map(
      (ticket) =>
        new Ticket({
          id: ticket.id,
          name: ticket.name,
          ownerId: ticket.ownerId,
          accessType: ticket.accessType,
          createdAt: ticket.createdAt,
          categoryId: ticket.categoryId || "",
          position: ticket.position,
          hidden: ticket.hidden,
          saleStatus: ticket.saleStatus as TicketSaleStatus,
          description: ticket.description || "",
          updatedAt: ticket.updatedAt,
          usedQuantity: ticket.usedQuantity,
          stock: {
            total: ticket.stock.total,
            available: ticket.stock.available,
            type: ticket.stock.type,
          },
          price: {
            price: ticket.price.price,
            currency: ticket.price.currency as Currency,
          },
          status: ticket.status,
        })
    );
  }
}
