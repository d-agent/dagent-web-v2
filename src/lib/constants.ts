import { Agent, ApiKey } from './types';

export const MOCK_AGENTS: Agent[] = [
    {
        id: '1',
        name: 'AlphaTrader V2',
        description: 'High-frequency sentiment analysis agent specialized in crypto markets.',
        costPerRequest: 0.05,
        provider: 'Anthropic',
        model: 'claude-3-opus',
        type: 'Multi-Agent',
        framework: 'LangGraph',
        isStreaming: true,
        deployedAt: '2023-10-25',
        owner: '0x123...456',
        status: 'Active',
        stakedAmount: 5000,
        // @ts-ignore
        gasFee: '0.15 ADA',
        // @ts-ignore
        contractAddress: 'addr1...8x92',
        // @ts-ignore
        blockTime: '20s'
    },
    {
        id: '2',
        name: 'CodeAuditor Pro',
        description: 'Smart contract vulnerability scanner and automated fixer.',
        costPerRequest: 0.12,
        provider: 'Gemini',
        model: 'gemini-1.5-pro',
        type: 'Single',
        framework: 'ADK',
        isStreaming: false,
        deployedAt: '2023-11-02',
        owner: '0xabc...def',
        status: 'Active',
        stakedAmount: 12500,
        // @ts-ignore
        gasFee: '0.08 ADA',
        // @ts-ignore
        contractAddress: 'addr1...7k21',
        // @ts-ignore
        blockTime: '15s'
    },
    {
        id: '3',
        name: 'CopyWrite Gen',
        description: 'Marketing copy generator optimized for Web3 projects.',
        costPerRequest: 0.02,
        provider: 'OpenAI',
        model: 'gpt-4o',
        type: 'Single',
        framework: 'ADK',
        isStreaming: true,
        deployedAt: '2024-01-15',
        owner: '0x999...888',
        status: 'Inactive',
        stakedAmount: 100,
        // @ts-ignore
        gasFee: '0.05 ADA',
        // @ts-ignore
        contractAddress: 'addr1...3m44',
        // @ts-ignore
        blockTime: '10s'
    }
];

export const MOCK_API_KEYS: ApiKey[] = [
    {
        id: 'key_1',
        name: 'Prod Backend',
        prefix: 'dg_live_...',
        permissions: { read: true, write: true, execute: true, admin: false },
        createdAt: '2024-02-10',
        lastUsed: '2 mins ago'
    },
    {
        id: 'key_2',
        name: 'Dev Test',
        prefix: 'dg_test_...',
        permissions: { read: true, write: false, execute: true, admin: false },
        createdAt: '2024-03-05',
        lastUsed: '2 days ago'
    }
];

export const MOCK_TRANSACTIONS = [
    { id: 'tx_1', type: 'Reward Claim', amount: '+45.20 DAG', date: '2 mins ago', status: 'Confirmed', hash: '0x88...21a' },
    { id: 'tx_2', type: 'Agent Stake', amount: '-5000.00 DAG', date: '1 day ago', status: 'Confirmed', hash: '0x33...44b' },
    { id: 'tx_3', type: 'API Top-up', amount: '-100.00 USD', date: '3 days ago', status: 'Confirmed', hash: '0x11...99c' },
    { id: 'tx_4', type: 'Deployment Fee', amount: '-5.00 DAG', date: '1 week ago', status: 'Confirmed', hash: '0x22...55d' },
];

export const MOCK_STAKES = [
    { id: 'st_1', agentName: 'AlphaTrader V2', amount: 5000, apy: 14.2, earned: 124.50 },
    { id: 'st_2', agentName: 'CodeAuditor Pro', amount: 1500, apy: 9.8, earned: 45.20 },
];

export const ADK_SNIPPET = `import { Agent, Task } from '@dagent/adk';

// Define your sovereign agent
const researcher = new Agent({
  role: 'Researcher',
  goal: 'Analyze market trends',
  llm: 'gemini-2.5-flash',
  wallet: process.env.AGENT_WALLET
});

// Create an autonomous task
const task = new Task({
  description: 'Find latest DeFi protocols',
  expectedOutput: 'JSON list of protocols',
  agent: researcher
});

// Execute on the decentralized layer
await task.execute();`;

export const LANGGRAPH_SNIPPET = `import { StateGraph } from "@langchain/langgraph";
import { DagentWrapper } from "@dagent/langgraph-adapter";

// Initialize existing graph
const graph = new StateGraph({
  channels: { messages: { reducer: (a, b) => a.concat(b) } }
});

graph.addNode("agent", runAgent);
graph.addNode("tool", executeTool);
graph.addEdge("agent", "tool");

// Wrap for decentralized deployment
const app = DagentWrapper(graph.compile(), {
  network: 'dagent-mainnet',
  monetization: { enabled: true, cost: 0.05 }
});`;

export const PYTHON_SDK_SNIPPET = `from dagent_tool import dagent_connect

# Set your API key
DAGENT_API_KEY = "your_api_key_here"

# Connect and deploy your agent
agent = dagent_connect(
    api_key=DAGENT_API_KEY,
    network='cardano-mainnet'
)

# Deploy to marketplace
agent.deploy(
    name='MyAgent',
    description='AI agent description',
    cost_per_request=0.05
)`;

export const CREWAI_SNIPPET = `from crewai import Agent, Task, Crew
from dagent_tool import dagent_tool

# Create your agent with Dagent integration
researcher = Agent(
    role='Research Assistant',
    goal='Gather and analyze information',
    tools=[dagent_tool],
    backstory='Expert researcher with access to Dagent network',
    verbose=True
)

# Define tasks
task = Task(
    description='Research latest AI trends',
    agent=researcher
)

# Create and deploy crew
crew = Crew(
    agents=[researcher],
    tasks=[task]
)

crew.kickoff()`;
