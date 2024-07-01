import { Transaction } from "@modules/orders/application/repository/Transaction";



export class MockTransaction implements Transaction {
  async execute<T>(fn: (session: any) => Promise<T>): Promise<T> {
    return await fn({});
  }
}