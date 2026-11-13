import { Router } from "express"

import { DashboardController } from "./dashboard.controller.js"

const dashboardRoutes = Router()
const controller = new DashboardController()

dashboardRoutes.get("/summary", controller.summary)

export { dashboardRoutes }
