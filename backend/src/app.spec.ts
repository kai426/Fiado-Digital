import request from "supertest"
import { describe, expect, it } from "vitest"

import { app } from "./app.js"

describe("GET /api/v1/health", () => {
  it("informa que a API está ativa", async () => {
    const response = await request(app).get("/api/v1/health")

    expect(response.status).toBe(200)
    expect(response.body.data).toMatchObject({
      status: "ok",
      service: "fiado-digital-api",
    })
  })
})

describe("proteção e validação HTTP", () => {
  it("bloqueia uma rota protegida sem token", async () => {
    const response = await request(app).get("/api/v1/customers")

    expect(response.status).toBe(401)
    expect(response.body.error.code).toBe("UNAUTHORIZED")
  })

  it("rejeita um cadastro inválido antes de acessar o banco", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "A",
      email: "invalido",
      password: "123",
      store: { name: "X" },
    })

    expect(response.status).toBe(422)
    expect(response.body.error.code).toBe("VALIDATION_ERROR")
  })
})
