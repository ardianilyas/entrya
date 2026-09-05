import { describe, beforeEach, it, expect } from "vitest";
import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import request from "supertest";
import app from "@/server.ts";
import {
  ORGANIZER_ADMIN_TEST_ROUTE,
} from "@/features/organizer/organizer.constant.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";

describe("Organizer Admin Endpoint", () => {
  let organizerId: string;

  beforeEach(async () => {
    const organizers = await seedOrganizers(1, {
      overrides: { isVerified: false, status: "PENDING" },
    });
    organizerId = organizers[0]?.id ?? "";
  });

  // ─── POST /api/organizers/admin/:id/verify ──────────────────────────────────
  describe("POST /api/organizers/admin/:id/verify", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await request(app).post(
        ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(401);
    });

    it("should return 403 when authenticated as a regular user", async () => {
      const { agent } = await authenticate("user");

      const response = await agent.post(
        ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(403);
    });

    it("should return 403 when authenticated as an organizer", async () => {
      const { agent } = await authenticate("organizer");

      const response = await agent.post(
        ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(403);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const { agent } = await authenticate("admin");

      const response = await agent.post(
        ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER("not-a-uuid")
      );

      expect(response.status).toBe(400);
    });

    it("should return 200 and verify the organizer as admin", async () => {
      const { agent } = await authenticate("admin");

      const response = await agent.post(
        ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER(organizerId)
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data.id).toBe(organizerId);
      expect(response.body.data.isVerified).toBe(true);
    });

    it("should persist verified status after verification", async () => {
      const { agent } = await authenticate("admin");

      await agent.post(ORGANIZER_ADMIN_TEST_ROUTE.VERIFY_ORGANIZER(organizerId));

      // Re-fetch via the public GET endpoint
      const getResponse = await request(app).get(
        `/api/organizers/${organizerId}`
      );

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.isVerified).toBe(true);
    });
  });
});
