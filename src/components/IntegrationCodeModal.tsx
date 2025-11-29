"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Agent } from '@/lib/types';

interface IntegrationCodeModalProps {
    agent: Agent;
    onClose: () => void;
}

export const IntegrationCodeModal: React.FC<IntegrationCodeModalProps> = ({ agent, onClose }) => {
    const [copied, setCopied] = useState(false);

    const generateIntegrationCode = () => {
        const agentSlug = agent.name.toLowerCase().replace(/\s+/g, '-');
        
        if (agent.framework === 'ADK') {
            return `import { Agent } from '@dagent/adk';

// Initialize ${agent.name}
const agent = new Agent({
  agentId: '${agent.id}',
  agentName: '${agent.name}',
  apiKey: process.env.DAGENT_API_KEY,
  endpoint: 'https://api.dagent.io/v1/agents/${agentSlug}'
});

// Send a message
const response = await agent.chat({
  message: 'Your message here',
  stream: ${agent.isStreaming}
});

console.log(response);`;
        } else {
            return `import { DagentClient } from '@dagent/langgraph';

// Initialize ${agent.name}
const client = new DagentClient({
  apiKey: process.env.DAGENT_API_KEY,
  agentId: '${agent.id}'
});

// Send a message
const response = await client.invoke({
  agent: '${agentSlug}',
  input: { message: 'Your message here' },
  stream: ${agent.isStreaming}
});

console.log(response);`;
        }
    };

    const code = generateIntegrationCode();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Integration Code</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                    Copy and paste this code into your project to integrate <span className="text-primary font-bold">{agent.name}</span>
                </p>

                <div className="relative">
                    <div className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                            <code>{code}</code>
                        </pre>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check size={16} className="text-primary" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">
                        <span className="text-primary font-bold">Note:</span> Make sure to set your API key in environment variables:
                    </p>
                    <code className="text-xs text-gray-300 font-mono bg-black/50 px-2 py-1 rounded">
                        DAGENT_API_KEY=your_api_key_here
                    </code>
                </div>
            </motion.div>
        </div>
    );
};

