import  { type AxiosInstance } from "axios";
import * as axios from "axios";
import { env } from "@/shared/config/env.ts";

interface CreateQrisPaymentParams {
  amount: number;
  referenceId: string;
}

interface BorderpayPaymentResponse {
  id: string;
  reference_id: string;
  status: string;
  amount: number;
  qr_string: string;
  pay_url: string;
  expires_at: string;
}

class BorderpayClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.BORDERPAY_API_URL,
      headers: {
        Authorization: `Bearer ${env.BORDERPAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 10_000,
    });
  }

  async createQrisPayment(
    params: CreateQrisPaymentParams,
  ): Promise<BorderpayPaymentResponse> {
    const { data } = await this.client.post<BorderpayPaymentResponse>("/payments", {
      amount: params.amount,
      reference_id: params.referenceId,
      method: "qris",
    });

    return data;
  }
}

export const borderpayClient = new BorderpayClient();