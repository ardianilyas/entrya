import { payments } from "@/shared/db/schemas";

export type Payment = typeof payments.$inferSelect;
export type CreatePaymentData = typeof payments.$inferInsert;
export type UpdatePaymentData = Partial<CreatePaymentData>;
