import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { AuthModule } from './auth';
import { AgentModule } from './agents';
import { ApiKeyModule } from './apikeys';

class ApiSdk {
  private static instance: ApiSdk;
  private axiosInstance: AxiosInstance;
  
  public auth: AuthModule;
  public agents: AgentModule;
  public apiKeys: ApiKeyModule;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.dagent.dev',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    
    this.auth = new AuthModule(this.axiosInstance);
    this.agents = new AgentModule(this.axiosInstance);
    this.apiKeys = new ApiKeyModule(this.axiosInstance);
  }

  static getInstance(): ApiSdk {
    if (!ApiSdk.instance) {
      ApiSdk.instance = new ApiSdk();
    }
    return ApiSdk.instance;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken?: string) {
    Cookies.set('access_token', accessToken, { expires: 7 });
    localStorage.setItem('access_token', accessToken);
    
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30 });
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return Cookies.get('access_token') || localStorage.getItem('access_token');
  }
}

const api = ApiSdk.getInstance();
export default api;