import type {
  CreatePaymentData,
  Payment,
  UpdatePaymentData,
} from "@/features/payment/payment.dto.ts";
import type { DbTransaction } from "@/shared/db";

export interface PaymentInterface {
  createPayment(tx: DbTransaction, data: CreatePaymentData): Promise<Payment | undefined>;
  updatePayment(id: string, data: UpdatePaymentData): Promise<Payment | undefined>
}