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

  async findByIds(ticketIds: string[], ownerId: string): Promise<Ticket[]> {
    const tickets = await this.client.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
        ownerId,
        status: "ACTIVE",
      },
      orderBy: { position: "asc" },
    });

    if (!tickets || !tickets.length) return [];

    return tickets.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        updatedAt: ticket.updatedAt,
        description: ticket.description || "",
        ownerId: ticket.ownerId,
        price: {
          price: ticket.priceValue,
          currency: ticket.currency as Currency,
        },
        stock: {
          total: ticket.stockTotal,
          type: ticket.stockType,
          available: ticket.stockAvailable,
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
    });
  }


  async findOne(query: any): Promise<Ticket | null> {
     const ticket = await this.client.ticket.findFirst({
      where: {
        ...query,
        status: "ACTIVE",
      }
     })
     
      if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      price: {
        price: ticket.priceValue,
        currency: ticket.currency as Currency,
      },
      stock: {
        total: ticket.stockTotal,
        type: ticket.stockType,
        available: ticket.stockAvailable,
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
      }
    });

    if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      price: {
        price: ticket.priceValue,
        currency: ticket.currency as Currency,
      },
      stock: {
        total: ticket.stockTotal,
        type: ticket.stockType,
        available: ticket.stockAvailable,
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
            priceValue: ticket.price.price,
            currency: ticket.price.currency as CurrencyPrisma,
            stockAvailable: ticket.stock.available,
            stockTotal: ticket.stock.total,
            stockType: ticket.stock.type,
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
      orderBy: { position: "asc" },
    });

    if (!tickets || !tickets.length) return [];

    return tickets.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || "",
        ownerId: ticket.ownerId,
        updatedAt: ticket.updatedAt,
        createdAt: ticket.createdAt,
        status: ticket.status as Status,
        price: {
          price: ticket.priceValue,
          currency: ticket.currency as Currency,
        },
        stock: {
          total: ticket.stockTotal,
          type: ticket.stockType,
          available: ticket.stockAvailable,
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
      }
    });

    if (!ticket) return null;

    return new Ticket({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description || "",
      ownerId: ticket.ownerId,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      status: ticket.status as Status,
      price: {
        price: ticket.priceValue,
        currency: ticket.currency as Currency,
      },
      stock: {
        total: ticket.stockTotal,
        type: ticket.stockType,
        available: ticket.stockAvailable,
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
      orderBy: { position: "asc" },
    })

    if (!result || !result.length) return [];

    return result.map((ticket) => {
      return new Ticket({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || "",
        createdAt: ticket.createdAt,
        status: ticket.status,
        updatedAt: ticket.updatedAt,
        ownerId: ticket.ownerId,
        price: {
          price: ticket.priceValue,
          currency: ticket.currency as Currency,
        },
        stock: {
          total: ticket.stockTotal,
          type: ticket.stockType,
          available: ticket.stockAvailable,
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
        await transaction.ticket.create({
          data: {
            id: ticket.id,
            name: ticket.name,
            description: ticket.description || "",
            ownerId: ticket.ownerId,
            priceValue: ticket.price.price,
            currency: ticket.price.currency as CurrencyPrisma,
            stockAvailable: ticket.stock.available,
            stockTotal: ticket.stock.total,
            stockType: ticket.stock.type,
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

  async updateMany(tickets: Ticket[]): Promise<void> {
    try {
      await this.client.$transaction(async (transaction) => {
        await Promise.all(
          tickets.map(async (ticket) => {
            await transaction.ticket.update({
              where: {
                id: ticket.id,
              },
              data: {
                name: ticket.name,
                description: ticket.description || "",
                priceValue: ticket.price.price,
                currency: ticket.price.currency as CurrencyPrisma,
                stockAvailable: ticket.stock.available,
                stockTotal: ticket.stock.total,
                stockType: ticket.stock.type,
                updatedAt: ticket.updatedAt,
                status: ticket.status as Status,
                createdAt: ticket.createdAt,
                saleStatus: ticket.saleStatus,
                accessType: ticket.accessType as AccessType,
                usedQuantity: ticket.usedQuantity,
                position: ticket.position,
                hidden: ticket.hidden,
                categoryId: ticket.categoryId || null,
              },
            });
          })
        );
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error updating tickets");
    }
  }
}
