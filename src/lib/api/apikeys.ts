import { AxiosInstance } from 'axios';
import { z } from 'zod';

const ApiKey = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string().optional(),
  createdAt: z.string().optional(),
});

export class ApiKeyModule {
  private axios: AxiosInstance;
  
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async createApiKey(name: string) {
    const response = await this.axios.post('/apikey/create', { name });
    return response;
  }

  async getAllApiKeys() {
    const response = await this.axios.get('/apikey/all');
    return response;
  }

  async updateApiKey(apiKeyId: string) {
    const response = await this.axios.put('/apikey/update', { api_key_id: apiKeyId });
    return response;
  }

  async deleteApiKey(apiKeyId: string) {
    const response = await this.axios.delete('/apikey/delete', {
      data: { api_key_id: apiKeyId }
    });
    return response;
  }
}