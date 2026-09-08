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
);

export const eventStatusEnum = pgEnum("event_status", [
  "DRAFT",
  "PUBSLIHED",
  "CANCELLED",
  "COMPLETED",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
  "EXPIRED"
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "CANCELLED",
  "CHECKED_IN"
]);

export type Role = (typeof roleEnum.enumValues)[number];
export type OrganizerStatus = (typeof organizerStatusEnum.enumValues)[number];
export type EventStatus = (typeof eventStatusEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type TicketStatus = (typeof ticketStatusEnum.enumValues)[number];
