import { api } from "@/lib/api";


export interface SubscriptionProduct {
    id: string;
    name: string;
    description: string;
    prices: {
        id: string;
        unitAmount: number;
        currency: string;
        interval: string;
    }[];
}

export interface CreateSubscriptionData {
  priceId: string;
}

export const subscriptionService = {
    async getProducts(): Promise<SubscriptionProduct[]>{
        const response = await api.get('/subscriptions/products');
        return response.data;
    },

    async createSubscription(data: CreateSubscriptionData){
        const response = await api.post('/subscriptions', data);
        return response.data;
    },

      async getUserSubscriptions() {
        const response = await api.get('/subscriptions');
        return response.data;
    },

    async getActiveSubscription() {
        const response = await api.get('/subscriptions/active');
        return response.data;
    },

    async cancelSubscription(subscriptionId: string){
    const response = await api.delete(`/subscriptions/${subscriptionId}`);
    return response.data;
    }

}