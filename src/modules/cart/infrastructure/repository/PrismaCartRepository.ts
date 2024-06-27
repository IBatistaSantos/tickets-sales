import { CartRepository } from "@modules/cart/application/repository/CartRepository";
import { Cart } from "@modules/cart/domain/entity/Cart";
import { Owner } from "@modules/owner/domain/entity/Owner";
import { Ticket } from "@modules/tickets/domain/entity/Ticket";
import { Currency } from "@modules/tickets/domain/valueObject/TicketPrice";
import { PrismaClient, Status } from "@prisma/client";
import { randomUUID } from "crypto";

export class PrismaCartRepository implements CartRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async save(cart: Cart): Promise<void> {
    await this.client.cart.create({
      data: {
        id: cart.id,
        ownerId: cart.ownerId,
        status: cart.status as Status,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        items: {
          create: cart.items.map((item) => ({
            id: randomUUID(),
            ticketId: item.ticketId,
            quantity: item.quantity,
            users: {
              create: item.users.map((user) => ({
                id: randomUUID(),
                name: user.name,
                email: user.email,
                infoExtra: JSON.stringify(user.infoExtra) || ''
              })),
            },
          })),
        },
        customerEmail: cart.customer?.email,
        customerName: cart.customer?.name,
        marketingData: {
          create: {
            utmMedium: cart.marketingData.utmMedium || cart.marketingData.utm_medium,
            utmSource: cart.marketingData.utmSource || cart.marketingData.utm_source,
            utmCampaign: cart.marketingData.utmCampaign || cart.marketingData.utm_campaign,
            utmContent: cart.marketingData.utmContent || cart.marketingData.utm_content,
          },
        },
      },
    });
    
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
