import { Router } from "express"

import { authenticate } from "../../shared/http/middlewares/authenticate.js"
import { AuthController } from "./auth.controller.js"

const authRoutes = Router()
const controller = new AuthController()

authRoutes.post("/register", controller.register)
authRoutes.post("/login", controller.login)
authRoutes.get("/me", authenticate, controller.me)

export { authRoutes }
