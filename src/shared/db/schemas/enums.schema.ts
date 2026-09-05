import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", 
  ["admin", "user", "organizer"]
);

export const organizerStatusEnum = pgEnum("organizer_status",
  [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "SUSPENDED",
  ]
)