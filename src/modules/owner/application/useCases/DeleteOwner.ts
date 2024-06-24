import { CacheProvider } from "../../../../core/providers/cache/CacheProvider";
import { OwnerNotFoundException } from "../../domain/errors/OwnerNotFound";
import { OwnerRepository } from "../repository/OwnerRepository";



export class DeleteOwner {
  constructor(
    private ownerRepository: OwnerRepository,
    private cacheProvider: CacheProvider
  ) {}

  async execute(ownerId: string) {
    const owner = await this.ownerRepository.findById(ownerId);

    if (!owner) {
      throw new OwnerNotFoundException();
    }

    owner.deactivate();
    await this.ownerRepository.update(owner);
    await this.cacheProvider.del(ownerId);
  }
}