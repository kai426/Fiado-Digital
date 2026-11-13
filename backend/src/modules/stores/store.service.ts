import { AppError } from "../../shared/errors/app-error.js"
import { StoreRepository } from "./store.repository.js"
import type { UpdateStoreInput } from "./store.schemas.js"

export class StoreService {
  constructor(private readonly repository = new StoreRepository()) {}

  async show(storeId: string) {
    const store = await this.repository.findById(storeId)
    if (!store) throw new AppError("Comércio não encontrado", 404, "STORE_NOT_FOUND")
    return store
  }

  async update(storeId: string, input: UpdateStoreInput) {
    await this.show(storeId)
    return this.repository.update(storeId, input)
  }
}
