import { CacheProvider } from "../../providers/cache/CacheProvider";
import Redis from 'ioredis';


export class RedisCacheProvider implements CacheProvider {
  private static instance: RedisCacheProvider;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
    })
  }



   static getInstance() {
    if (!RedisCacheProvider.instance) {
      RedisCacheProvider.instance = new RedisCacheProvider();
    }
    return RedisCacheProvider.instance;
  }


  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
}