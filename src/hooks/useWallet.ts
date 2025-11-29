import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useWalletBalanceQuery = () => {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => api.wallet.getBalance(),
    retry: false,
  });
};

export const useWalletTransactionsQuery = () => {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => api.wallet.getTransactions(),
    retry: false,
  });
};

export const useWalletStakesQuery = () => {
  return useQuery({
    queryKey: ['wallet', 'stakes'],
    queryFn: () => api.wallet.getStakes(),
    retry: false,
  });
};

export const useStakeToAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, amount }: { agentId: string; amount: number }) =>
      api.wallet.stakeToAgent(agentId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useUnstakeFromAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stakeId: string) => api.wallet.unstakeFromAgent(stakeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useClaimRewardsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stakeId: string) => api.wallet.claimRewards(stakeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};