import { Router } from "express"

import { MovementController } from "./movement.controller.js"

const movementRoutes = Router()
const controller = new MovementController()

movementRoutes.get("/", controller.list)

export { movementRoutes }
