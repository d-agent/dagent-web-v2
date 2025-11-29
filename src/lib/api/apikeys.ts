import { AxiosInstance } from 'axios';
import { z } from 'zod';

const ApiKey = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string().optional(),
  createdAt: z.string().optional(),
});

export class ApiKeyModule {
  constructor(private axios: AxiosInstance) {}

  async createApiKey(name: string) {
    const response = await this.axios.post('/apikey/create', { name });
    return ApiKey.parse(response);
  }

  async getAllApiKeys() {
    const response = await this.axios.get('/apikey/all');
    return z.array(ApiKey).parse(response);
  }

  async updateApiKey(apiKeyId: string) {
    const response = await this.axios.put('/apikey/update', { api_key_id: apiKeyId });
    return ApiKey.parse(response);
  }

  async deleteApiKey(apiKeyId: string) {
    const response = await this.axios.delete('/apikey/delete', { 
      data: { api_key_id: apiKeyId } 
    });
    return response;
  }
}