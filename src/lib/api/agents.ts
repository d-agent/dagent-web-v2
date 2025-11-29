import { AxiosInstance } from 'axios';
import { z } from 'zod';

const AgentResponse = z.object({
  message: z.string(),
  data: z.any(),
});

const Agent = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  agentCost: z.string(),
  deployedUrl: z.string(),
  llmProvider: z.string(),
  skills: z.array(z.string()),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

export class AgentModule {
  constructor(private axios: AxiosInstance) {}

  async callAgent(requirementJson: any, message: string, apiKey?: string) {
    const headers = apiKey ? { 'x-api-key': apiKey } : {};
    const response = await this.axios.post('/dagent', 
      { requirement_json: requirementJson, message }, 
      { headers }
    );
    return AgentResponse.parse(response);
  }

  async runAgent(id: string, message: string) {
    const response = await this.axios.post(`/dagent/${id}/run`, { message });
    return AgentResponse.parse(response);
  }

  async createAgent(data: {
    name: string;
    description: string;
    agentCost: string;
    deployedUrl: string;
    llmProvider: string;
    skills: string[];
    is_multiAgentSystem?: boolean;
    default_agent_name?: string;
    framework_used?: string;
    can_stream?: boolean;
  }) {
    const response = await this.axios.post('/dagent/create', data);
    return Agent.parse(response);
  }

  async verifyAgent(deployedUrl: string, defaultAgentName?: string) {
    const response = await this.axios.post('/dagent/verify', {
      deployedUrl,
      default_agent_name: defaultAgentName,
    });
    return response;
  }

  async getAllAgents() {
    console.log('🤖 AgentModule: getAllAgents called');
    const response = await this.axios.get('/dagent/all');
    console.log('🤖 AgentModule: Raw response received', response);
    const parsed = z.array(Agent).parse(response);
    console.log('🤖 AgentModule: Parsed agents', parsed);
    return parsed;
  }

  async getAgent(id: string) {
    const response = await this.axios.get(`/dagent/${id}`);
    return Agent.parse(response);
  }

  async updateAgent(id: string, data: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    isPublic: boolean;
  }>) {
    const response = await this.axios.put(`/dagent/${id}`, data);
    return Agent.parse(response);
  }

  async deleteAgent(id: string) {
    const response = await this.axios.delete(`/dagent/${id}`);
    return response;
  }

  async streamAgent(id: string, message: string): Promise<ReadableStream> {
    const response = await fetch(`${this.axios.defaults.baseURL}/dagent/${id}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ message, streaming: true }),
    });
    
    if (!response.body) throw new Error('No response body');
    return response.body;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] || 
           localStorage.getItem('access_token');
  }
}