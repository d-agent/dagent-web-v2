import { AxiosInstance } from 'axios';
import { z } from 'zod';

const WalletBalance = z.object({
  ada: z.number(),
  usd: z.number(),
});

const Transaction = z.object({
  id: z.string(),
  type: z.string(),
  amount: z.string(),
  date: z.string(),
  status: z.string(),
  hash: z.string(),
});

const Stake = z.object({
  id: z.string(),
  agentName: z.string(),
  amount: z.number(),
  apy: z.number(),
  earned: z.number(),
});

export class WalletModule {
  constructor(private axios: AxiosInstance) {}

  async getBalance() {
    const response = await this.axios.get('/wallet/balance');
    return WalletBalance.parse(response);
  }

  async getTransactions() {
    const response = await this.axios.get('/wallet/transactions');
    return z.array(Transaction).parse(response);
  }

  async getStakes() {
    const response = await this.axios.get('/wallet/stakes');
    return z.array(Stake).parse(response);
  }

  async stakeToAgent(agentId: string, amount: number) {
    const response = await this.axios.post('/wallet/stake', {
      agentId,
      amount,
    });
    return response;
  }

  async unstakeFromAgent(stakeId: string) {
    const response = await this.axios.delete(`/wallet/stake/${stakeId}`);
    return response;
  }

  async claimRewards(stakeId: string) {
    const response = await this.axios.post(`/wallet/claim/${stakeId}`);
    return response;
  }
}