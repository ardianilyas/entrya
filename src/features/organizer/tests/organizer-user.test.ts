import { describe, beforeEach, it, expect } from "vitest";
import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import type { CreateOrganizerDto } from "@/features/organizer/organizer.dto.ts";
import request from "supertest";
import app from "@/server.ts";
import {
  ORGANIZER_NOT_FOUND,
  ORGANIZER_USER_TEST_ROUTE,
} from "@/features/organizer/organizer.constant.ts";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";

describe("Organizer User Endpoint", () => {
  let organizerId: string;
  let payload: CreateOrganizerDto;

  beforeEach(async () => {
    const organizers = await seedOrganizers(1);
    organizerId = organizers[0]?.id ?? "";

    payload = {
      name: "Test Organizer",
      bio: "A great organizer bio",
    };
  });

  // ─── GET /api/organizers ────────────────────────────────────────────────────
  describe("GET /api/organizers", () => {
    it("should return 200 with an array of organizers", async () => {
      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZERS
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return all seeded organizers", async () => {
      await seedOrganizers(2);

      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZERS
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── GET /api/organizers/:id ────────────────────────────────────────────────
  describe("GET /api/organizers/:id", () => {
    it("should return 400 when id is not a valid UUID", async () => {
      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZER("not-a-uuid")
      );

      expect(response.status).toBe(400);
    });

    it("should return 404 when organizer does not exist", async () => {
      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZER(INVALID_ID)
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(ORGANIZER_NOT_FOUND);
    });

    it("should return 200 with the correct organizer", async () => {
      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data.id).toBe(organizerId);
    });
  });

  // ─── GET /api/organizers/me ─────────────────────────────────────────────────
  describe("GET /api/organizers/me", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_MY_ORGANIZER
      );

      expect(response.status).toBe(401);
    });

    it("should return the current user's organizer profile", async () => {
      const { agent, userId } = await authenticate("user");

      await seedOrganizers(1, { userIds: [userId] });

      const response = await agent.get(
        ORGANIZER_USER_TEST_ROUTE.GET_MY_ORGANIZER
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data.userId).toBe(userId);
    });

    it("should return null when the user has no organizer", async () => {
      const { agent } = await authenticate("user");

      const response = await agent.get(
        ORGANIZER_USER_TEST_ROUTE.GET_MY_ORGANIZER
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeFalsy();
    });
  });

  // ─── POST /api/organizers ───────────────────────────────────────────────────
  describe("POST /api/organizers", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app)
        .post(ORGANIZER_USER_TEST_ROUTE.CREATE_ORGANIZER)
        .send(payload);

      expect(response.status).toBe(401);
    });

    it("should return 400 when name is missing", async () => {
      const { agent } = await authenticate("user");

      const response = await agent
        .post(ORGANIZER_USER_TEST_ROUTE.CREATE_ORGANIZER)
        .send({ bio: "some bio" });

      expect(response.status).toBe(400);
    });

    it("should return 400 when bio is missing", async () => {
      const { agent } = await authenticate("user");

      const response = await agent
        .post(ORGANIZER_USER_TEST_ROUTE.CREATE_ORGANIZER)
        .send({ name: "Some Name" });

      expect(response.status).toBe(400);
    });

    it("should return 400 when body is empty", async () => {
      const { agent } = await authenticate("user");

      const response = await agent
        .post(ORGANIZER_USER_TEST_ROUTE.CREATE_ORGANIZER)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return 201 and create an organizer with correct fields", async () => {
      const { agent, userId } = await authenticate("user");

      const response = await agent
        .post(ORGANIZER_USER_TEST_ROUTE.CREATE_ORGANIZER)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data.name).toBe(payload.name);
      expect(response.body.data.bio).toBe(payload.bio);
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.data.isVerified).toBe(false);
      expect(response.body.data.status).toBe("PENDING");
      expect(response.body.data.id).toBeDefined();
    });
  });

  // ─── PATCH /api/organizers/:id ──────────────────────────────────────────────
  describe("PATCH /api/organizers/:id", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app)
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER(organizerId))
        .send({ name: "Updated Name" });

      expect(response.status).toBe(401);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const { agent } = await authenticate("user");

      const response = await agent
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER("not-a-uuid"))
        .send({ name: "Updated Name" });

      expect(response.status).toBe(400);
    });

    it("should return 404 when organizer does not exist", async () => {
      const { agent } = await authenticate("user");

      const response = await agent
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER(INVALID_ID))
        .send({ name: "Updated Name" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(ORGANIZER_NOT_FOUND);
    });

    it("should return 200 and update organizer name", async () => {
      const { agent } = await authenticate("user");
      const updatedName = "Updated Organizer Name";

      const response = await agent
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER(organizerId))
        .send({ name: updatedName });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updatedName);
      expect(response.body.data.id).toBe(organizerId);
    });

    it("should return 200 and partially update organizer bio", async () => {
      const { agent } = await authenticate("user");
      const updatedBio = "A fresh new bio text";

      const response = await agent
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER(organizerId))
        .send({ bio: updatedBio });

      expect(response.status).toBe(200);
      expect(response.body.data.bio).toBe(updatedBio);
    });

    it("should return 200 and update both name and bio", async () => {
      const { agent } = await authenticate("user");
      const update = { name: "New Name", bio: "New Bio" };

      const response = await agent
        .patch(ORGANIZER_USER_TEST_ROUTE.UPDATE_ORGANIZER(organizerId))
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(update.name);
      expect(response.body.data.bio).toBe(update.bio);
    });
  });

  // ─── DELETE /api/organizers/:id ─────────────────────────────────────────────
  describe("DELETE /api/organizers/:id", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app).delete(
        ORGANIZER_USER_TEST_ROUTE.DELETE_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(401);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const { agent } = await authenticate("user");

      const response = await agent.delete(
        ORGANIZER_USER_TEST_ROUTE.DELETE_ORGANIZER("not-a-uuid")
      );

      expect(response.status).toBe(400);
    });

    it("should return 404 when organizer does not exist", async () => {
      const { agent } = await authenticate("user");

      const response = await agent.delete(
        ORGANIZER_USER_TEST_ROUTE.DELETE_ORGANIZER(INVALID_ID)
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(ORGANIZER_NOT_FOUND);
    });

    it("should return 200 and delete the organizer", async () => {
      const { agent } = await authenticate("user");

      const response = await agent.delete(
        ORGANIZER_USER_TEST_ROUTE.DELETE_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(200);
    });

    it("should no longer find the organizer after deletion", async () => {
      const { agent } = await authenticate("user");

      await agent.delete(ORGANIZER_USER_TEST_ROUTE.DELETE_ORGANIZER(organizerId));

      const getResponse = await request(app).get(
        ORGANIZER_USER_TEST_ROUTE.GET_ORGANIZER(organizerId)
      );

      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe(ORGANIZER_NOT_FOUND);
    });
  });
});
