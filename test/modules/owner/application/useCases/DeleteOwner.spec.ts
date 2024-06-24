import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { DeleteOwner } from "../../../../../src/modules/owner/application/useCases/DeleteOwner";
import { OwnerRepository } from "../../../../../src/modules/owner/application/repository/OwnerRepository";
import { CacheProvider } from "../../../../../src/core/providers/cache/CacheProvider";
import { MockOwnerRepository } from "../../mocks/repository/MockOwnerRepository";
import { MockCacheProvider } from "../../mocks/cache/MockCacheProvider";
import { Owner } from "../../../../../src/modules/owner/domain/entity/Owner";
import { OwnerNotFoundException } from "../../../../../src/modules/owner/domain/errors/OwnerNotFound";



describe("DeleteOwner", () => {
  let deleteOwner: DeleteOwner;
  let repository: OwnerRepository;
  let cache: CacheProvider;

  beforeEach(() => {
    repository = new MockOwnerRepository();
    cache = new MockCacheProvider();
    deleteOwner = new DeleteOwner(repository, cache);
  });
  it("should delete owner", async() => {
    const owner = new Owner({ id: "123", name: "John Doe", organizerId: "org123" });
    repository.save(owner);


    const updateSpy = spyOn(repository, "update");
    await deleteOwner.execute("123");

    expect(updateSpy).toBeCalledWith(
      expect.objectContaining({
        id: "123",
        status: "INACTIVE"
      })
    )
  })

  it("should throw an error if owner not found", () => {
    expect(deleteOwner.execute("123")).rejects.toThrow(
      OwnerNotFoundException
    );
  });
})