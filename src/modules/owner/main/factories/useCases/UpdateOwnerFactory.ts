import { RedisCacheProvider } from "../../../../../core/infrastructure/cache/RedisCacheProvider"
import { GetOwner } from "../../../application/useCases/GetOwner"
import { UpdateOwner } from "../../../application/useCases/UpdateOwner"
import { OwnerRepositoryPrisma } from "../../../infrastructure/repository/OwnerRepositoryPrisma"


export const makeUpdateOwnerUseCaseFactory = () => {
  const cacheProvider = RedisCacheProvider.getInstance()
  return new UpdateOwner(new OwnerRepositoryPrisma(), cacheProvider)
}