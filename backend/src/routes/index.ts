import { Router } from "express"

import { authRoutes } from "../modules/auth/auth.routes.js"
import { customerRoutes } from "../modules/customers/customer.routes.js"
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes.js"
import { healthRoutes } from "../modules/health/health.routes.js"
import { movementRoutes } from "../modules/movements/movement.routes.js"
import { storeRoutes } from "../modules/stores/store.routes.js"
import { authenticate } from "../shared/http/middlewares/authenticate.js"

const routes = Router()

routes.use("/health", healthRoutes)
routes.use("/auth", authRoutes)

routes.use(authenticate)
routes.use("/store", storeRoutes)
routes.use("/customers", customerRoutes)
routes.use("/movements", movementRoutes)
routes.use("/dashboard", dashboardRoutes)

export { routes }
