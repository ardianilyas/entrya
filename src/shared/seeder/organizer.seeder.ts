import { faker } from "@faker-js/faker";
import { db } from "@/shared/db";
import { organizer, type OrganizerStatus } from "@/shared/db/schemas";
import { seedUsers } from "./user.seeder.ts";
import type { Organizer } from "@/features/organizer/organizer.dto.ts";

export type SeedOrganizerOverride = Partial<{
  name: string;
  bio: string | null;
  isVerified: boolean;
  status: OrganizerStatus;
  rejectionReason: string | null;
}>;

export type SeedOrganizersOptions = {
  /**
   * List of user IDs to use for organizers.
   * - If provided, organizers will reference these IDs.
   * - If more user IDs are needed than provided, new users will be automatically created via seedUsers.
   */
  userIds?: string[];
  /**
   * Optional per-organizer overrides.
   * If array length < count, remaining organizers get random data.
   */
  overrides?: SeedOrganizerOverride | SeedOrganizerOverride[];
};

export async function seedOrganizers(
  count: number = 1,
  options?: SeedOrganizersOptions
): Promise<Organizer[]> {

  const { userIds = [], overrides } = options ?? {};

  const availableUserIds = [...userIds];
  if (availableUserIds.length < count) {
    const extraUsers = await seedUsers(count - availableUserIds.length);
    availableUserIds.push(...extraUsers.map((u) => u.id));
  }

  const normalizeOverrides = (): SeedOrganizerOverride[] => {
    if (!overrides) return Array.from({ length: count }, () => ({}));
    if (Array.isArray(overrides)) {
      const arr = [...overrides];
      while (arr.length < count) {
        arr.push({});
      }
      return arr.slice(0, count);
    }
    return Array.from({ length: count }, () => overrides ?? {});
  };

  const overrideList = normalizeOverrides();

  type OrganizerInsert = typeof organizer.$inferInsert;

  // @ts-ignore
  const values: OrganizerInsert[] = overrideList.map((ov, i) => {
    const statusOptions: OrganizerStatus[] = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ] as OrganizerStatus[];

    const status =
      ov.status ??
      (faker.helpers.arrayElement(statusOptions) as OrganizerStatus);

    return {
      userId: availableUserIds[i],
      name:
        ov.name ??
        `${faker.company.name()} ${faker.helpers.arrayElement(["Events", "Studio", "Lab", "Group"])}`,
      bio: ov.bio ?? faker.lorem.sentence({ min: 8, max: 20 }),
      isVerified: ov.isVerified ?? status === "APPROVED",
      status,
      rejectionReason:
        ov.rejectionReason ??
        (status === "REJECTED" ? faker.lorem.sentence() : null),
      // createdAt/updatedAt are handled by DB defaults & $onUpdate
    };
  });

  return db.insert(organizer).values(values).returning();
}