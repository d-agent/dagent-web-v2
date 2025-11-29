'use client';

import { useState } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useCreateAgentMutation, useVerifyAgentMutation } from '@/hooks/useAgents';

interface CreateAgentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAgentForm({ onClose, onSuccess }: CreateAgentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agentCost: '',
    deployedUrl: '',
    llmProvider: '',
    skills: '',
    is_multiAgentSystem: false,
    default_agent_name: '',
    framework_used: '',
    can_stream: false,
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const createAgentMutation = useCreateAgentMutation();
  const verifyAgentMutation = useVerifyAgentMutation();

  const handleVerifyUrl = async () => {
    if (!formData.deployedUrl) return;
    
    setIsVerifying(true);
    setVerificationStatus('idle');

    try {
      await verifyAgentMutation.mutateAsync({
        deployedUrl: formData.deployedUrl,
        defaultAgentName: formData.default_agent_name || undefined,
      });
      setVerificationStatus('success');
    } catch (error) {
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAgentMutation.mutateAsync({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create New Agent</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="My AI Agent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cost per Request *
              </label>
              <input
                type="text"
                required
                value={formData.agentCost}
                onChange={(e) => setFormData({ ...formData, agentCost: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="0.05"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none h-24 resize-none"
              placeholder="Describe what your agent does..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deployed URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={formData.deployedUrl}
                onChange={(e) => setFormData({ ...formData, deployedUrl: e.target.value })}
                className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="https://your-agent.com/api"
              />
              <button
                type="button"
                onClick={handleVerifyUrl}
                disabled={!formData.deployedUrl || isVerifying}
                className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : verificationStatus === 'success' ? (
                  <Check size={16} />
                ) : verificationStatus === 'error' ? (
                  <AlertCircle size={16} />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                LLM Provider *
              </label>
              <select
                required
                value={formData.llmProvider}
                onChange={(e) => setFormData({ ...formData, llmProvider: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Provider</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="cohere">Cohere</option>
                <option value="huggingface">Hugging Face</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Framework Used
              </label>
              <select
                value={formData.framework_used}
                onChange={(e) => setFormData({ ...formData, framework_used: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Framework</option>
                <option value="google_adk">Google ADK</option>
                <option value="crew_ai">Crew AI</option>
                <option value="langgraph">LangGraph</option>
                <option value="openai">OpenAI</option>
                <option value="autogen">AutoGen</option>
                <option value="autogpt">AutoGPT</option>
                <option value="semantic_kernel">Semantic Kernel</option>
                <option value="openai_agents">OpenAI Agents</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="web scraping, data analysis, code generation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Default Agent Name (for multi-agent systems)
            </label>
            <input
              type="text"
              value={formData.default_agent_name}
              onChange={(e) => setFormData({ ...formData, default_agent_name: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="main_agent"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.is_multiAgentSystem}
                onChange={(e) => setFormData({ ...formData, is_multiAgentSystem: e.target.checked })}
                className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
              />
              Multi-Agent System
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.can_stream}
                onChange={(e) => setFormData({ ...formData, can_stream: e.target.checked })}
                className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
              />
              Supports Streaming
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAgentMutation.isPending}
              className="flex-1 py-2.5 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createAgentMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Agent'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}