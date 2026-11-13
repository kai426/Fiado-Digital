import { Router } from "express"

import { StoreController } from "./store.controller.js"

const storeRoutes = Router()
const controller = new StoreController()

storeRoutes.get("/me", controller.show)
storeRoutes.patch("/me", controller.update)

export { storeRoutes }
