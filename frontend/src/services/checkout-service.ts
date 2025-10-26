import { api } from '@/lib/api';

export interface CreateSubscriptionCheckoutData {
  priceId: string;
}

export interface CreatePaymentCheckoutData {
  amount: number;
  currency: string;
  description: string;
}

export const checkoutService = {
  async createSubscriptionCheckout(data: CreateSubscriptionCheckoutData) {
    const response = await api.post('/checkout/subscription', data);
    return response.data;
  },

  async createPaymentCheckout(data: CreatePaymentCheckoutData) {
    const response = await api.post('/checkout/payment', data);
    return response.data;
  },

  async getCheckoutSession(sessionId: string) {
    const response = await api.get(`/checkout/session/${sessionId}`);
    return response.data;
  },

  async createPortalSession() {
    const response = await api.post('/checkout/portal');
    return response.data;
  },
};