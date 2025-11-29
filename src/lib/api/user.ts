import { AxiosInstance } from 'axios';
import { z } from 'zod';

const UserProfile = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string(),
  walletAddress: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.string().optional(),
});

const NotificationSettings = z.object({
  deploymentStatus: z.boolean(),
  stakingRewards: z.boolean(),
  securityAlerts: z.boolean(),
});

export class UserModule {
  constructor(private axios: AxiosInstance) {}

  async getProfile() {
    const response = await this.axios.get('/user/profile');
    return UserProfile.parse(response);
  }

  async updateProfile(data: Partial<{
    displayName: string;
    email: string;
    avatar: string;
  }>) {
    const response = await this.axios.put('/user/profile', data);
    return UserProfile.parse(response);
  }

  async getNotificationSettings() {
    const response = await this.axios.get('/user/notifications');
    return NotificationSettings.parse(response);
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    const response = await this.axios.put('/user/notifications', settings);
    return NotificationSettings.parse(response);
  }

  async getSessions() {
    const response = await this.axios.get('/user/sessions');
    return z.array(z.object({
      id: z.string(),
      device: z.string(),
      location: z.string(),
      lastActive: z.string(),
      current: z.boolean().optional(),
    })).parse(response);
  }

  async revokeSession(sessionId: string) {
    const response = await this.axios.delete(`/user/sessions/${sessionId}`);
    return response;
  }
}