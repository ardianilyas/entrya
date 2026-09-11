import type { PaymentRepository } from "@/features/payment/repositories/payment.repository.ts";
import type { CreatePaymentDto, Payment } from "@/features/payment/payment.dto.ts";

export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async createPayment(data: CreatePaymentDto): Promise<Payment | undefined> {
    return this.paymentRepository.createPayment(data);
  }
}
