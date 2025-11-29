import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export const useGetNonce = () => {
  return useMutation({
    mutationFn: (address: string) => api.auth.getNonce(address),
  });
};

export const useVerifySignature = () => {
  return useMutation({
    mutationFn: ({ address, signature }: { 
      address: string; 
      signature: { key: string; signature: string } 
    }) => api.auth.verifySignature(address, signature),
    onSuccess: (data) => {
      api.setTokens(data.token, undefined, data.userId);
    },
  });
};