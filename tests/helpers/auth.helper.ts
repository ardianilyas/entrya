import request from "supertest";
import app from "../../src/server";
import { db } from "@/shared/db";
import * as schema from "../../src/shared/db/schemas";
import type { UserRole } from "@/shared/types/express";
import { eq } from "drizzle-orm";
import { faker } from "@faker-js/faker";

export async function authenticate(role: UserRole = "user") {
  const agent = request.agent(app)

  const user = {
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  const signUpRes = await agent
    .post("/api/auth/sign-up/email")
    .send(user)

  const userId: string = signUpRes.body?.user?.id ?? ""

  await db.update(schema.user).set({ role }).where(eq(schema.user.id, userId))

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    })

  return {
    user,
    userId,
    agent
  }
}