import { Router } from "express"

import { HealthController } from "./health.controller.js"

const healthRoutes = Router()
const controller = new HealthController()

healthRoutes.get("/", controller.check)
healthRoutes.get("/ready", controller.readiness)

export { healthRoutes }
