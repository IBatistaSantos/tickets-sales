import { CacheProvider } from "../../../../core/providers/cache/CacheProvider";
import { OwnerNotFoundException } from "../../domain/errors/OwnerNotFound";
import { OwnerRepository } from "../repository/OwnerRepository";

export class GetOwner {
  constructor(
    private ownerRepository: OwnerRepository,
    private cacheProvider: CacheProvider
  ) {}

  async execute(ownerId: string) {
    const isCached = await this.cacheProvider.get(ownerId);
    if (isCached) return JSON.parse(isCached);

    const owner = await this.ownerRepository.findById(ownerId);
    if (!owner) {
      throw new OwnerNotFoundException();
    }

    await this.cacheProvider.set(ownerId, JSON.stringify(owner));
    return owner.toJSON();
  }
}
