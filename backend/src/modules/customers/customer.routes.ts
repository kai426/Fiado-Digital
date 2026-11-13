import { Router } from "express"

import { MovementController } from "../movements/movement.controller.js"
import { CustomerController } from "./customer.controller.js"

const customerRoutes = Router()
const controller = new CustomerController()
const movementController = new MovementController()

customerRoutes.get("/", controller.list)
customerRoutes.post("/", controller.create)
customerRoutes.get("/:customerId", controller.show)
customerRoutes.patch("/:customerId", controller.update)
customerRoutes.delete("/:customerId", controller.archive)
customerRoutes.post("/:customerId/sales", movementController.createSale)
customerRoutes.post("/:customerId/payments", movementController.createPayment)

export { customerRoutes }
