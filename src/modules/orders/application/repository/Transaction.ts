export interface Transaction {
  execute<T>(fn: (session: any) => Promise<T>): Promise<T>;
}