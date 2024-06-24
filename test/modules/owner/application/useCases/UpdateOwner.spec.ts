import { describe, it, expect, beforeEach, spyOn } from "bun:test";

import { OwnerRepository } from "../../../../../src/modules/owner/application/repository/OwnerRepository";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";
import { MockOwnerRepository } from "../../mocks/repository/MockOwnerRepository";
import { GetOwner } from "../../../../../src/modules/owner/application/useCases/GetOwner";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";
import { CacheProvider } from "../../../../../src/core/providers/cache/CacheProvider";
import { MockCacheProvider } from "../../mocks/cache/MockCacheProvider";
import { UpdateOwner } from "../../../../../src/modules/owner/application/useCases/UpdateOwner";

describe("UpdateOwner", () => {
  let updateOwner: UpdateOwner;
  let repository: OwnerRepository;
  let cache: CacheProvider

  beforeEach(() => {
    repository = new MockOwnerRepository();
    cache =  new MockCacheProvider();
    updateOwner = new UpdateOwner(repository, cache);
  });

  it("should update owner", async () => {
    const owner = new Owner({ id: "123", name: "John Doe", organizerId: "org123" });
    repository.save(owner);

   const response =  await updateOwner.execute({ ownerId: "123", name: "Jane Doe" });
    
   expect(response).toHaveProperty("id");
   expect(response.name).toBe("Jane Doe");
  });


  it("should throw an error if owner not found", () => {
    expect(updateOwner.execute({ownerId: "123", name: "Jane"})).rejects.toThrow(
      OwnerNotFoundException
    );
  });
});
