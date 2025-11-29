import { AxiosInstance } from 'axios';
import { z } from 'zod';

const NonceResponse = z.object({
  nonce: z.string(),
});

const VerifyResponse = z.object({
  token: z.string(),
});

export class AuthModule {
  private axios: AxiosInstance;
  
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async getNonce(address: string) {
    const response = await this.axios.post('/auth/nonce', { address });
    return response;
  }

  async verifySignature(address: string, signature: { key: string; signature: string }) {
    const response = await this.axios.post('/auth/verify', { address, signature });
    return response;
  }
}