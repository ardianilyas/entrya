import { faker } from "@faker-js/faker";
import { auth } from "@/shared/lib/auth";
import type { User } from "better-auth";

export type SeedUserOverride = Partial<{
  email: string;
  name: string;
  password: string;
}>;

export async function seedUsers(
  count: number,
  overrides?: SeedUserOverride | SeedUserOverride[]
): Promise<User[]> {
  const createdUsers: User[] = [];

  const normalizeOverrides = (): SeedUserOverride[] => {
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

  for (let i = 0; i < count; i++) {
    const ov = overrideList[i];

    const email = ov?.email ?? faker.internet.email();
    const name = ov?.name ?? faker.person.fullName();
    const password = ov?.password ?? faker.internet.password({ length: 12 });

    // Better Auth sign up via email
    const result = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
      },
    });

    // Extract the user object from the response
    // signUpEmail typically returns { user, token, ... } or similar
    const user: User =
      result && typeof result === "object" && "user" in result
        ? (result as { user: User }).user
        : (result as unknown as User);

    createdUsers.push(user);
  }

  return createdUsers;
}