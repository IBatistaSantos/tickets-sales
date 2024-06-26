import { AccessType, PrismaClient, Status } from "@prisma/client";
import { Owner } from "../../../owner/domain/entity/Owner";
import { TicketRepository } from "../../application/repository/TicketRepository";
import { Ticket, TicketSaleStatus } from "../../domain/entity/Ticket";
import { Currency } from "../../domain/valueObject/TicketPrice";
import { Currency as CurrencyPrisma } from "@prisma/client";

export class PrismaTicketRepository implements TicketRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }
  async findOne(query: any): Promise<Ticket | null> {
     const ticket = await this.client.ticket.findFirst({
      where: {
        ...query,
        status: "ACTIVE",
      },
      include: {
        price: true,
        stock: true,
      },
     })
     
      if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      price: {
        price: ticket.price.price,
        currency: ticket.price.currency as Currency,
      },
      stock: {
        total: ticket.stock.total,
        type: ticket.stock.type,
        available: ticket.stock.available,
      },
      saleStatus: ticket.saleStatus as TicketSaleStatus,
      accessType: ticket.accessType,
      status: ticket.status,
      createdAt: ticket.createdAt,
      usedQuantity: ticket.usedQuantity,
      position: ticket.position,
      hidden: ticket.hidden,
      categoryId: ticket.categoryId || "",
    })

  }

  async findById(ticketId: string): Promise<Ticket | null> {
    const ticket = await this.client.ticket.findFirst({
      where: {
        id: ticketId,
        status: "ACTIVE",
      },
      include: {
        price: true,
        stock: true,
      },
    });

    if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      price: {
        price: ticket.price.price,
        currency: ticket.price.currency as Currency,
      },
      stock: {
        total: ticket.stock.total,
        type: ticket.stock.type,
        available: ticket.stock.available,
      },
      saleStatus: ticket.saleStatus as TicketSaleStatus,
      accessType: ticket.accessType,
      status: ticket.status,
      createdAt: ticket.createdAt,
      usedQuantity: ticket.usedQuantity,
      position: ticket.position,
      hidden: ticket.hidden,
      categoryId: ticket.categoryId || "",
    });
  }

  async update(ticket: Ticket): Promise<void> {
    try {
      await this.client.$transaction(async (transaction) => {
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
                currency: ticket.price.currency as CurrencyPrisma,
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
    } catch (error) {
      console.error(error);
      throw new Error("Error updating ticket");
    }
  }

  async findAll(ownerId: string): Promise<Ticket[]> {
    const tickets = await this.client.ticket.findMany({
      where: {
        ownerId,
        status: "ACTIVE",
      },
      include: {
        price: true,
        stock: true,
      },
    });

    if (!tickets || !tickets.length) return [];

    return tickets.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || "",
        ownerId: ticket.ownerId,
        price: {
          price: ticket.price.price,
          currency: ticket.price.currency as Currency,
        },
        stock: {
          total: ticket.stock.total,
          type: ticket.stock.type,
          available: ticket.stock.available,
        },
        saleStatus: ticket.saleStatus as TicketSaleStatus,
        accessType: ticket.accessType,
        usedQuantity: ticket.usedQuantity,
        position: ticket.position,
        hidden: ticket.hidden,
        categoryId: ticket.categoryId || "",
      });
    });
  }

  async findByName(name: string, ownerId: string): Promise<Ticket | null> {
    const ticket = await this.client.ticket.findFirst({
      where: {
        name,
        ownerId,
        status: "ACTIVE",
      },
      include: {
        price: true,
        stock: true,
      },
    });

    if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      price: {
        price: ticket.price.price,
        currency: ticket.price.currency as Currency,
      },
      stock: {
        total: ticket.stock.total,
        type: ticket.stock.type,
        available: ticket.stock.available,
      },
      saleStatus: ticket.saleStatus as TicketSaleStatus,
      accessType: ticket.accessType,
      usedQuantity: ticket.usedQuantity,
      position: ticket.position,
      hidden: ticket.hidden,
      categoryId: ticket.categoryId || "",
    });
  }

  async listTickets(ownerId: string): Promise<Ticket[]> {
    const result = await this.client.ticket.findMany({
      where: {
        ownerId: ownerId,
        status: "ACTIVE",
        hidden: false,
        saleStatus: "AVAILABLE",
      },
      include: { price: true, stock: true },
    });

    if (!result || !result.length) return [];

    return result.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || "",
        ownerId: ticket.ownerId,
        price: {
          price: ticket.price.price,
          currency: ticket.price.currency as Currency,
        },
        stock: {
          total: ticket.stock.total,
          type: ticket.stock.type,
          available: ticket.stock.available,
        },
        saleStatus: ticket.saleStatus as TicketSaleStatus,
        accessType: ticket.accessType,
        usedQuantity: ticket.usedQuantity,
        position: ticket.position,
        hidden: ticket.hidden,
        categoryId: ticket.categoryId || "",
      });
    });
  }

  async getOwnerById(ownerId: string): Promise<Owner | null> {
    const owner = await this.client.owner.findFirst({
      where: {
        id: ownerId,
        status: "ACTIVE",
      },
    });

    if (!owner) return null;

    return new Owner({
      id: owner.id,
      name: owner.name,
      organizerId: owner.organizerId,
      accessType: owner.accessType,
    });
  }

  async save(ticket: Ticket): Promise<void> {
    try {
      await this.client.$transaction(async (transaction) => {
        const price = await transaction.ticketPrice.create({
          data: {
            price: ticket.price.price,
            currency: ticket.price.currency as CurrencyPrisma,
          },
        });
        const stock = await transaction.ticketStock.create({
          data: {
            total: ticket.stock.total,
            type: ticket.stock.type,
            available: ticket.stock.available,
          },
        });

        await transaction.ticket.create({
          data: {
            id: ticket.id,
            name: ticket.name,
            description: ticket.description || "",
            ownerId: ticket.ownerId,
            priceId: price.id,
            stockId: stock.id,
            createdAt: ticket.createdAt,
            status: ticket.status as Status,
            updatedAt: ticket.updatedAt,
            saleStatus: ticket.saleStatus,
            accessType: ticket.accessType as AccessType,
            usedQuantity: ticket.usedQuantity,
            position: ticket.position,
            hidden: ticket.hidden,
            categoryId: ticket.categoryId || null,
          },
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error saving ticket");
    }
  }
}
