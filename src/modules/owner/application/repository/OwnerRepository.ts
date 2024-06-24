import { Owner } from "../../domain/entity/Owner";

export interface OwnerRepository {
  findById(ownerId: string): Promise<Owner | null>;
  findByOrganizerId(organizerId: string): Promise<Owner | null>;
  update(owner: Owner): Promise<void>;
  save(owner: Owner): Promise<void>;
}
