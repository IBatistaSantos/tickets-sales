import { RedisCacheProvider } from "../../../../../core/infrastructure/cache/RedisCacheProvider"
import { DeleteOwner } from "../../../application/useCases/DeleteOwner"
import { OwnerRepositoryPrisma } from "../../../infrastructure/repository/OwnerRepositoryPrisma"

export const makeDeleteOwnerUseCaseFactory = () => {
  const cacheProvider = RedisCacheProvider.getInstance()
  return new DeleteOwner(new OwnerRepositoryPrisma(), cacheProvider)
}