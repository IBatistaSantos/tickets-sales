import { Transaction } from "@modules/orders/application/repository/Transaction";
import { Prisma, PrismaClient } from "@prisma/client";

export class PrismaTransaction implements Transaction {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async execute<T>(fn: (session: any) => Promise<T>): Promise<T> {
    return this.client.$transaction(async (tx) => fn(tx));
  }
}
