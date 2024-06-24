import { OwnerRepository } from "../../../../../src/modules/owner/application/repository/OwnerRepository";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";

export class MockOwnerRepository implements OwnerRepository {
  
  
  private owners: Owner[] = [];

  async findByOrganizerId(organizerId: string): Promise<Owner | null> {
    const owner = this.owners.find(
      (owner) => owner.organizerId === organizerId
    );
    return owner || null;
  }

 async findById(ownerId: string): Promise<Owner | null> {
    const owner = this.owners.find(
      (owner) => owner.id === ownerId
    );
    return owner || null;
  }

  async save(owner: Owner) {
    this.owners.push(owner);
  }

  async update(owner: Owner): Promise<void> {
    const index = this.owners.findIndex((o) => o.id === owner.id);
    this.owners[index] = owner;
  }
}
