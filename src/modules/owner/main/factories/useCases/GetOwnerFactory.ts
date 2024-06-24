import { RedisCacheProvider } from "../../../../../core/infrastructure/cache/RedisCacheProvider"
import { GetOwner } from "../../../application/useCases/GetOwner"
import { OwnerRepositoryPrisma } from "../../../infrastructure/repository/OwnerRepositoryPrisma"


export const makeGetOwnerUseCaseFactory = () => {
  const cacheProvider = RedisCacheProvider.getInstance()
  return new GetOwner(new OwnerRepositoryPrisma(), cacheProvider)
}