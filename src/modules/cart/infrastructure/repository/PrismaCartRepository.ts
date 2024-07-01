import { CartRepository } from "@modules/cart/application/repository/CartRepository";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { Owner } from "@modules/owner/domain/entity/Owner";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";
import { CartStatus, PrismaClient, Status } from "@prisma/client";
import { randomUUID } from "crypto";

export class PrismaCartRepository implements CartRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async findById(cartId: string): Promise<Cart | null> {
    const cart = await this.client.cart.findUnique({
      where: {
        id: cartId,
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
      updatedAt: cart.updatedAt,
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

  async save(cart: Cart): Promise<void> {
    await this.client.cart.create({
      data: {
        id: cart.id,
        ownerId: cart.ownerId,
        status: cart.status as Status,
        statusCart: cart.statusCart as CartStatus,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
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
        customerEmail: cart.customer?.email,
        customerName: cart.customer?.name,
        marketingData: {
          create: {
            utmMedium:
              cart.marketingData.utmMedium || cart.marketingData.utm_medium,
            utmSource:
              cart.marketingData.utmSource || cart.marketingData.utm_source,
            utmCampaign:
              cart.marketingData.utmCampaign || cart.marketingData.utm_campaign,
            utmContent:
              cart.marketingData.utmContent || cart.marketingData.utm_content,
          },
        },
      },
    });
  }

  async update(cart: Cart): Promise<void> {

    const cartDb = await this.client.cart.findUnique({
      where: {
        id: cart.id,
        status: "ACTIVE",
      },
      include: {
        items: true,
        marketingData: true,
      }
    })

    if (!cartDb) throw new Error("Cart not found");

    for (const iterator of cartDb?.items) {
      await this.client.user.deleteMany({
        where: {
          itemId: iterator.id,
        },
      });
    }

    await this.client.cart.update({
      where: {
        id: cart.id,
        status: "ACTIVE"
      },
      data: {
        items: {
          deleteMany: {}
        }
      }
    })

     await this.client.cart.update({
      where: {
        id: cart.id,
        status: "ACTIVE"
      },
      data: {
        status: cart.status as Status,
        updatedAt: cart.updatedAt,
        statusCart: cart.statusCart as CartStatus,
        createdAt: cart.createdAt,
        ...cart.customer && {
          customerEmail: cart.customer.email,
          customerName: cart.customer.name,
        },
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
      }
    })
  }

  async getOwnerId(ownerId: string): Promise<Owner | null> {
    const response = await this.client.owner.findUnique({
      where: {
        id: ownerId,
        status: "ACTIVE",
      },
    });

    if (!response) return null;

    return new Owner({
      name: response.name,
      organizerId: response.organizerId,
      accessType: response.accessType as any,
      createdAt: response.createdAt,
      id: response.id,
      status: response.status as any,
      updatedAt: response.updatedAt,
    });
  }

  async getTicketsByIds(ticketIds: string[]): Promise<Ticket[]> {
    const listTickets = await this.client.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
        status: "ACTIVE",
      },
      include: {
        price: true,
        stock: true,
      },
    });

    if (!listTickets || !listTickets.length) return [];

    return listTickets.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || "",
        ownerId: ticket.ownerId,
        stock: {
          type: ticket.stock.type as any,
          available: ticket.stock.available,
          total: ticket.stock.total,
        },
        price: {
          price: ticket.price.price,
          currency: ticket.price.currency as Currency,
        },
        accessType: ticket.accessType as any,
        categoryId: ticket.categoryId || "",
        hidden: ticket.hidden,
        position: ticket.position,
        saleStatus: ticket.saleStatus as any,
        usedQuantity: ticket.usedQuantity,
        status: ticket.status as any,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      });
    });
  }
}
