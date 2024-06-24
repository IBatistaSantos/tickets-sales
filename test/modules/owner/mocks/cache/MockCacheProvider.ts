import { CacheProvider } from "../../../../../src/core/providers/cache/CacheProvider";



export class MockCacheProvider implements CacheProvider {
  private cache: Record<string, string> = {};

  async del(key: string): Promise<void> {
    delete this.cache[key];
  }

  async get(key: string): Promise<string | null> {
    return this.cache[key] || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.cache[key] = value;
  }
}