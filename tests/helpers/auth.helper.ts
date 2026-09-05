import request from "supertest";
import app from "../../src/server";
import { db } from "@/shared/db";
import * as schema from "../../src/shared/db/schemas";
import type { UserRole } from "@/shared/types/express";
import { eq } from "drizzle-orm";

export async function authenticate(role: UserRole = "user") {
  const agent = request.agent(app)

  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  }

  await agent
    .post("/api/auth/sign-up/email")
    .send(user)

  await db.update(schema.user).set({ role }).where(eq(schema.user.email, user.email))

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    })

  return {
    user,
    agent
  }
}