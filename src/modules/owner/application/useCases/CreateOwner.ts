import { Owner } from "../../domain/entity/Owner";
import { OwnerAlreadyExists } from "../../domain/errors/OwnerAlreadyExists";
import { OwnerRepository } from "../repository/OwnerRepository";

interface Input {
  name: string;
  organizerId: string;
}

export class CreateOwnerUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute(input: Input) {
    const ownerAlreadyExists = await this.ownerRepository.findByOrganizerId(
      input.organizerId
    );

    if (ownerAlreadyExists) {
      throw new OwnerAlreadyExists();
    }

    const owner = new Owner({
      name: input.name,
      organizerId: input.organizerId,
    });

    await this.ownerRepository.save(owner);

    return { id: owner.id };
  }
}
