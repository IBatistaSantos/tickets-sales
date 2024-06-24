import { describe, it, expect, beforeEach, spyOn } from "bun:test";

import { OwnerRepository } from "../../../../../src/modules/owner/application/repository/OwnerRepository";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";
import { MockOwnerRepository } from "../../mocks/repository/MockOwnerRepository";
import { GetOwner } from "../../../../../src/modules/owner/application/useCases/GetOwner";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";
import { CacheProvider } from "../../../../../src/core/providers/cache/CacheProvider";
import { MockCacheProvider } from "../../mocks/cache/MockCacheProvider";

describe("GetOwner", () => {
  let getOwner: GetOwner;
  let repository: OwnerRepository;
  let cache: CacheProvider

  beforeEach(() => {
    repository = new MockOwnerRepository();
    cache =  new MockCacheProvider();
    getOwner = new GetOwner(repository, cache);
  });

  it("should return a owner", async () => {
    repository.save(new Owner({ id: "123" ,name: "John Doe", organizerId: "org123" }));
    
    const result = await getOwner.execute('123');
    expect(result).toHaveProperty("id");
    expect(result.id).toBe("123");
  });

  it ("should return a owner from cache", async () => {
    repository.save(new Owner({ id: "123" ,name: "John Doe", organizerId: "org123" }));
    await cache.set('123', JSON.stringify({ id: "123" ,name: "John Doe", organizerId: "org123" }));
    
    const cacheSpyOn  =  spyOn(cache, "get")
    const repositorySpyOn = spyOn(repository, "findById")
    
    const result = await getOwner.execute('123');

    expect(result).toHaveProperty("id");
    expect(cacheSpyOn).toBeCalledTimes(1);
    expect(repositorySpyOn).toBeCalledTimes(0);
    expect(result.id).toBe("123");
  })

  it("should throw an error if owner not found", () => {
    expect(getOwner.execute('123')).rejects.toThrow(
      OwnerNotFoundException
    );
  });
});
