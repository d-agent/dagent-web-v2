export interface Agent {
    id: string;
    name: string;
    description: string;
    costPerRequest: number;
    provider: 'OpenAI' | 'Anthropic' | 'Gemini' | 'Mistral' | 'Meta';
    model: string;
    type: 'Single' | 'Multi-Agent';
    framework: 'ADK' | 'LangGraph';
    isStreaming: boolean;
    deployedAt: string;
    owner: string;
    status: 'Active' | 'Inactive';
    stakedAmount: number;
}

export interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    permissions: {
        read: boolean;
        write: boolean;
        execute: boolean;
        admin: boolean;
    };
    createdAt: string;
    lastUsed: string;
}

export interface WalletStats {
    balance: number;
    staked: number;
    earnings: number;
    apy: number;
    address: string;
}

export enum Tab {
    HOME = 'HOME',
    FRAMEWORKS = 'FRAMEWORKS',
    AGENTS = 'AGENTS',
    API_KEYS = 'API_KEYS',
    WALLET = 'WALLET',
    SETTINGS = 'SETTINGS'
}
