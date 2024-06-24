import { CacheProvider } from "../../../../core/providers/cache/CacheProvider";
import { OwnerNotFoundException } from "../../domain/errors/OwnerNotFound";
import { OwnerRepository } from "../repository/OwnerRepository";

interface Input {
  ownerId: string;
  name: string;
}

export class UpdateOwner {
  constructor(
    private ownerRepository: OwnerRepository,
    private cacheProvider: CacheProvider
  ) {}

  async execute(input: Input) {
    const { ownerId, ...ownerData } = input;
    const owner = await this.ownerRepository.findById(ownerId);
    if (!owner) {
      throw new OwnerNotFoundException();
    }

    owner.update(ownerData);
    
    await this.ownerRepository.update(owner)
    await this.cacheProvider.del(ownerId);

    return owner.toJSON();
  }
}