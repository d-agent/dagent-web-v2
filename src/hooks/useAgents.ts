import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';

export const useListAgentsQuery = () => {
  console.log('🎣 useListAgentsQuery: Hook called');
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => {
      console.log('🎣 useListAgentsQuery: QueryFn executing');
      return api.agents.getAllAgents();
    },
    retry: false, // Disable retries to see error faster
  });
};

export const useAgentQuery = (id: string) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => api.agents.getAgent(id),
    enabled: !!id,
  });
};

export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.agents.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

export const useUpdateAgentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.agents.updateAgent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });
};

export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.agents.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

export const useVerifyAgentMutation = () => {
  return useMutation({
    mutationFn: ({ deployedUrl, defaultAgentName }: {
      deployedUrl: string;
      defaultAgentName?: string;
    }) => api.agents.verifyAgent(deployedUrl, defaultAgentName),
  });
};

export const useCallAgentMutation = () => {
  return useMutation({
    mutationFn: ({ requirementJson, message, apiKey }: {
      requirementJson: any;
      message: string;
      apiKey?: string;
    }) => api.agents.callAgent(requirementJson, message, apiKey),
  });
};

export const useRunAgentMutation = () => {
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => 
      api.agents.runAgent(id, message),
  });
};

export const useStreamingMessage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamData, setStreamData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const startStream = async (id: string, message: string) => {
    setIsStreaming(true);
    setStreamData('');
    setError(null);

    try {
      const stream = await api.agents.streamAgent(id, message);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setStreamData(prev => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stream error');
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    isStreaming,
    streamData,
    error,
    startStream,
  };
};