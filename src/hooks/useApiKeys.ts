import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useListApiKeysQuery = () => {
  return useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => api.apiKeys.getAllApiKeys(),
  });
};

export const useCreateApiKeyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => api.apiKeys.createApiKey(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
};

export const useUpdateApiKeyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (apiKeyId: string) => api.apiKeys.updateApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
};

export const useDeleteApiKeyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (apiKeyId: string) => api.apiKeys.deleteApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
};