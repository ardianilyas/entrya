import { seedUsers } from "./user.seeder.ts";
import { seedOrganizers } from "./organizer.seeder.ts";

async function main() {
  // 1. Seed users via Better Auth with Faker
  const users = await seedUsers(5, {
    password: "Password123!", // optional: same password for all
  });

  console.log(`Created ${users.length} users via Better Auth`);

  // 2. Seed organizers:
  // - Uses real user IDs passed in (auto-seeds extra users if needed)
  await seedOrganizers(10, {
    userIds: users.map((u) => u.id),
    overrides: [
      { name: "Official Events ID", status: "APPROVED" as const },
      { name: "Pending Org", status: "PENDING" as const },
    ],
  });

  await seedOrganizers(10, {
    // no userIds → seedOrganizers creates new real users automatically
    overrides: { status: "REJECTED" as const },
  });

  console.log("Seeding completed.");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});