import type { PaymentInterface } from "@/features/payment/repositories/payment.interface.ts";
import type {
  CreatePaymentData,
  Payment,
  UpdatePaymentData,
} from "@/features/payment/payment.dto.ts";
import { db, type DbTransaction } from "@/shared/db";
import { payments } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";

export class PaymentRepository implements PaymentInterface {
  async createPayment(tx: DbTransaction, data: CreatePaymentData): Promise<Payment | undefined> {
    const [payment] = await tx.insert(payments).values(data).returning();
    return payment;
  }

  async updatePayment(id: string, data: UpdatePaymentData): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return payment;
  }
}
