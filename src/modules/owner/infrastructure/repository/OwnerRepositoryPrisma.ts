import { PrismaClient, Status } from "@prisma/client";
import { OwnerRepository } from "../../application/repository/OwnerRepository";
import { Owner } from "../../domain/entity/Owner";

export class OwnerRepositoryPrisma implements OwnerRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async update(owner: Owner): Promise<void> {
    await this.prisma.owner.update({
      where: {
        id: owner.id,
        status: "ACTIVE"
      },
      data: {
        name: owner.name,
        updatedAt: owner.updatedAt,
        status: owner.status as Status,
      },
    });
  }
  async findById(ownerId: string): Promise<Owner | null> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        id: ownerId,
        status: "ACTIVE"
      },
    });

    if (!owner) {
      return null;
    }

    return new Owner({
      name: owner.name,
      organizerId: owner.organizerId,
      createdAt: owner.createdAt,
      id: owner.id,
      status: owner.status,
      updatedAt: owner.updatedAt,
    });
  }

  async save(owner: Owner): Promise<void> {
    await this.prisma.owner.create({
      data: {
        name: owner.name,
        organizerId: owner.organizerId,
        createdAt: owner.createdAt,
        id: owner.id,
        status: owner.status as Status,
        updatedAt: owner.updatedAt,
      },
    });
  }
  async findByOrganizerId(organizerId: string): Promise<Owner | null> {
    const owner = await this.prisma.owner.findFirst({
      where: {
        organizerId,
      },
    });

    if (!owner) {
      return null;
    }

    return new Owner({
      name: owner.name,
      organizerId: owner.organizerId,
      createdAt: owner.createdAt,
      id: owner.id,
      status: owner.status,
      updatedAt: owner.updatedAt,
    });
  }
}
