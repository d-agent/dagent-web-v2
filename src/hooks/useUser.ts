import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.user.getProfile(),
    retry: false,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<{
      displayName: string;
      email: string;
      avatar: string;
    }>) => api.user.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

export const useNotificationSettingsQuery = () => {
  return useQuery({
    queryKey: ['user', 'notifications'],
    queryFn: () => api.user.getNotificationSettings(),
    retry: false,
  });
};

export const useUpdateNotificationsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: {
      deploymentStatus: boolean;
      stakingRewards: boolean;
      securityAlerts: boolean;
    }) => api.user.updateNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'notifications'] });
    },
  });
};

export const useUserSessionsQuery = () => {
  return useQuery({
    queryKey: ['user', 'sessions'],
    queryFn: () => api.user.getSessions(),
    retry: false,
  });
};

export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.user.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'sessions'] });
    },
  });
};