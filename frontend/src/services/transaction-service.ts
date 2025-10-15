import { api } from "@/lib/api";

export interface CreateTransactionData {
  amount: number;
  currency: string;
  description: string;
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit';
  metadata?: any;   
}

export const transactionService = {
  async createTransaction(data: CreateTransactionData) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async getUserTransactions() {
    const response = await api.get('/transactions');
    return response.data;
  },

  async getTransaction(transactionId: string) {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },
};


