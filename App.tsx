import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Key, 
  Wallet, 
  LayoutGrid, 
  ArrowRight, 
  Check, 
  Search, 
  Plus, 
  Globe, 
  Shield, 
  Zap, 
  Code, 
  Copy,
  ChevronRight,
  BarChart3,
  Users,
  Twitter,
  Github,
  Disc,
  ArrowLeft,
  Filter,
  Trash2,
  Edit,
  SortAsc,
  CreditCard,
  History,
  TrendingUp,
  Download,
  Box,
  Layers,
  Play,
  Ban,
  BookOpen,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, ApiKey, Tab, WalletStats } from './types';
import { MOCK_AGENTS, MOCK_API_KEYS, ADK_SNIPPET, LANGGRAPH_SNIPPET, MOCK_TRANSACTIONS, MOCK_STAKES } from './constants';
import { AgentNetwork } from './components/AnimatedBeam';

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: 6450.25,
    staked: 5000.00,
    earnings: 342.10,
    apy: 12.5
  });

  // Navigation Helper
  const navItem = (tab: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm
        ${activeTab === tab 
          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // --- SUB-COMPONENTS --- //

  const Header = () => (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-2 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(Tab.HOME)}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center pixel-border-primary">
            <span className="font-pixel text-black text-[10px] font-bold">DA</span>
          </div>
          <span className="font-bold tracking-tight text-lg">dagent</span>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItem(Tab.HOME, 'Home', <LayoutGrid size={16} />)}
          {navItem(Tab.FRAMEWORKS, 'Frameworks', <Terminal size={16} />)}
          {navItem(Tab.AGENTS, 'Agents', <Users size={16} />)}
          {navItem(Tab.API_KEYS, 'API Keys', <Key size={16} />)}
        </nav>

        <button 
          onClick={() => {
            setActiveTab(Tab.WALLET);
            if (!isWalletConnected) setIsWalletConnected(true);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-mono text-xs border
            ${activeTab === Tab.WALLET 
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,255,148,0.3)]' 
              : 'bg-surface border-white/10 text-gray-400 hover:border-white/30'}`}
        >
          <Wallet size={14} />
          <span>{isWalletConnected ? '0x7F...3a9B' : 'Connect'}</span>
        </button>
      </div>
    </header>
  );

  const SubscriptionSection = () => (
    <section className="py-20 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Protocol</h2>
        <p className="text-gray-400">Scale your autonomous workforce with flexible staking tiers.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Devnet", price: "Free", features: ["1 Agent", "Testnet Deploy", "Community Support", "Basic Analytics"], color: "border-white/10" },
          { name: "Mainnet", price: "$49/mo", features: ["10 Agents", "Priority Staking", "Fast Inference", "Detailed Logs"], color: "border-primary", highlight: true },
          { name: "Validator", price: "Custom", features: ["Unlimited Agents", "Governance Rights", "Dedicated Nodes", "24/7 Support"], color: "border-secondary" }
        ].map((plan, i) => (
          <div key={i} className={`relative p-8 rounded-2xl bg-surface border ${plan.color} ${plan.highlight ? 'bg-surfaceHighlight shadow-[0_0_30px_rgba(0,255,148,0.1)]' : ''} flex flex-col`}>
             {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
             <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
             <div className="text-3xl font-mono font-bold mb-6">{plan.price}</div>
             <ul className="space-y-4 mb-8 flex-1">
               {plan.features.map((f, j) => (
                 <li key={j} className="flex items-center space-x-2 text-sm text-gray-400">
                   <Check size={14} className={plan.highlight ? "text-primary" : "text-gray-600"} />
                   <span>{f}</span>
                 </li>
               ))}
             </ul>
             <button className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${plan.highlight ? 'bg-primary text-black hover:bg-primaryDim' : 'bg-white/5 text-white hover:bg-white/10'}`}>
               Start Building
             </button>
          </div>
        ))}
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
             <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
               <span className="font-pixel text-black text-[8px] font-bold">DA</span>
             </div>
             <span className="font-bold text-lg">dagent</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            The decentralized layer for autonomous AI agents. stake, deploy, and earn.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-primary transition-colors">Frameworks</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Agents</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Staking</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
           <h4 className="font-bold mb-4 text-white">Stay Updated</h4>
           <div className="flex space-x-2 mb-4">
             <input type="email" placeholder="Enter email" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary w-full" />
             <button className="bg-primary text-black px-3 rounded-lg hover:bg-primaryDim">
               <ArrowRight size={16} />
             </button>
           </div>
           <div className="flex space-x-4">
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={18} /></a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><Disc size={18} /></a>
           </div>
        </div>
      </div>
      <div className="text-center text-gray-600 text-xs pt-8 border-t border-white/5">
        &copy; 2025 Dagent Protocol Foundation. All rights reserved.
      </div>
    </footer>
  );

  const LandingPage = () => (
    <div className="pt-32 px-6 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-mono tracking-wider">NETWORK LIVE v1.0.4</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-5xl mx-auto">
          Deploy Unstoppable <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Autonomous Agents</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          The first decentralized layer for AI sovereignty. Build, deploy, and stake on agents that work for you while you sleep.
        </p>

        <AgentNetwork />

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <button 
            onClick={() => setActiveTab(Tab.WALLET)}
            className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center space-x-2">
              <span>Connect Wallet</span>
              <ArrowRight size={20} />
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab(Tab.FRAMEWORKS)}
            className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
          >
            Read Documentation
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Sovereign Identity", desc: "Every agent gets its own on-chain identity and wallet.", icon: <Shield className="text-primary" /> },
          { title: "Proof of Computation", desc: "Verifiable inference logs ensuring your agent's actions are authentic.", icon: <Cpu className="text-secondary" /> },
          { title: "Instant Monetization", desc: "Stake tokens on high-performing agents and earn yield from API usage.", icon: <Zap className="text-accent" /> },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-surface border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className="w-12 h-12 bg-surfaceHighlight rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Dev Framework Teaser */}
      <section className="bg-surfaceHighlight/30 border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-secondary/10 blur-[100px]" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 flex-1">
            <h2 className="text-3xl font-bold">Built for Developers</h2>
            <p className="text-gray-400">Choose your weapon. Whether you prefer our native highly-optimized ADK or the flexibility of LangGraph, we support your workflow.</p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Check size={16} className="text-primary" /> <span>Type-safe</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Check size={16} className="text-primary" /> <span>Zero-config deploy</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab(Tab.FRAMEWORKS)}
              className="text-primary font-mono text-sm hover:underline flex items-center space-x-2"
            >
              <span>Explore Frameworks</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex-1 w-full max-w-md bg-[#0d0d0d] rounded-xl border border-white/10 p-4 font-mono text-xs shadow-2xl relative">
             <div className="absolute top-4 right-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="text-gray-500 mb-4 border-b border-white/5 pb-2">agent.ts</div>
            <pre className="text-gray-300 overflow-x-auto">
              <span className="text-secondary">import</span> {'{ Agent }'} <span className="text-secondary">from</span> <span className="text-primary">'@dagent/sdk'</span>;
              {'\n\n'}
              <span className="text-secondary">const</span> agent = <span className="text-secondary">new</span> <span className="text-yellow-300">Agent</span>({'{'}
              {'\n'}  name: <span className="text-primary">'SniperBot'</span>,
              {'\n'}  model: <span className="text-primary">'gemini-2.5-flash'</span>
              {'\n'});
              {'\n\n'}
              <span className="text-gray-500">// One line deploy</span>
              {'\n'}
              <span className="text-secondary">await</span> agent.<span className="text-blue-400">deploy</span>();
            </pre>
          </div>
        </div>
      </section>

      <SubscriptionSection />
      <Footer />
    </div>
  );

  // --- FRAMEWORKS PAGE (UPGRADED) ---
  const FrameworksPage = () => {
    const [selectedFramework, setSelectedFramework] = useState<'ADK' | 'LangGraph'>('ADK');
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    useEffect(() => {
      setTerminalLines([]);
      const lines = [
        `> Initializing ${selectedFramework} environment...`,
        `> Loading configuration...`,
        `> Connecting to Dagent Network (Mainnet)...`,
        `> Verifying agent signature... OK`,
        `> Deploying contract... 0x7F...3a9B`,
        `> Status: Active`
      ];
      
      let delay = 0;
      lines.forEach((line, index) => {
        delay += 600;
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
        }, delay);
      });
    }, [selectedFramework]);

    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-10">
          <div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Developer <span className="text-primary">Console</span></h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              The complete toolkit for building autonomous agents. 
            </p>
          </div>
          <div className="flex space-x-2 bg-surface border border-white/10 p-1 rounded-lg mt-6 md:mt-0">
            {['ADK', 'LangGraph'].map((fw) => (
              <button
                key={fw}
                onClick={() => setSelectedFramework(fw as any)}
                className={`px-6 py-2 rounded-md font-mono text-sm transition-all ${
                  selectedFramework === fw 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Documentation Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Description & Install */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                {selectedFramework === 'ADK' ? 'Native Agent Development Kit' : 'LangChain & LangGraph Integration'}
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                 {selectedFramework === 'ADK' 
                   ? 'Our high-performance native runtime designed specifically for autonomous economic agents. It includes built-in wallet management, verifiable inference logs, and direct access to the Dagent liquidity layer.' 
                   : 'Seamlessly port your existing LangChain agents or LangGraph workflows to the Dagent network. Our adapter wraps your graph with a decentralized identity and wallet, allowing it to transact on-chain instantly.'}
              </p>

              <div className="bg-[#050505] border border-white/10 rounded-lg p-4 flex items-center justify-between group max-w-md">
                <code className="text-gray-300 font-mono text-sm">
                  <span className="text-secondary">$</span> bun add @dagent/{selectedFramework.toLowerCase()}
                </code>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
              </div>

              <button className="flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all font-bold text-sm border border-white/10">
                <BookOpen size={18} />
                <span>Read Full Documentation</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Zap, title: "Instant Deploy", desc: "Deploy to our decentralized network in seconds with a single command." },
                { icon: Shield, title: "Wallet Built-in", desc: "Every agent comes with a secure, non-custodial wallet out of the box." },
                { icon: Layers, title: "State Management", desc: "Persistent memory and state across agent executions." },
                { icon: Globe, title: "Global Access", desc: "Your agent is instantly available via a global high-performance API." },
              ].map((item, i) => (
                <div key={i} className="bg-surface border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <item.icon size={20} />
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Code Snippet */}
            <div className="space-y-4">
               <h3 className="text-sm font-mono text-primary uppercase tracking-wider">Example Usage</h3>
               <div className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                 <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5 justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                       {selectedFramework === 'ADK' ? 'src/main.ts' : 'src/graph.ts'}
                    </span>
                 </div>
                 <div className="p-6 overflow-x-auto">
                   <pre className="font-mono text-sm leading-relaxed text-gray-300">
                     {selectedFramework === 'ADK' ? ADK_SNIPPET : LANGGRAPH_SNIPPET}
                   </pre>
                 </div>
               </div>
            </div>
          </div>

          {/* Visualization Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Terminal Simulation */}
            <div className="bg-[#050505] border border-white/10 rounded-xl p-6 h-[400px] font-mono text-sm relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 flex items-center px-4 space-x-2">
                 <Terminal size={12} className="text-gray-500" />
                 <span className="text-xs text-gray-500">Dagent CLI</span>
              </div>
              <div className="mt-8 space-y-2">
                <div className="text-gray-400">$ dagent deploy --network mainnet</div>
                {terminalLines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary"
                  >
                    {line}
                  </motion.div>
                ))}
                <motion.div 
                  animate={{ opacity: [0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-primary inline-block align-middle"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-surface to-surfaceHighlight border border-white/10 rounded-xl p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Box size={16} className="text-secondary" /> 
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between text-gray-400 hover:text-white cursor-pointer group">
                  <span>Full API Reference</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li className="flex items-center justify-between text-gray-400 hover:text-white cursor-pointer group">
                  <span>Community Examples</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li className="flex items-center justify-between text-gray-400 hover:text-white cursor-pointer group">
                  <span>Github Repository</span>
                  <Github size={14} />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Framework Comparison</h3>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-primary">Dagent ADK</th>
                  <th className="p-4 text-blue-400">LangChain / LangGraph</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-4 font-medium">Best For</td>
                  <td className="p-4">High-performance, native autonomous agents</td>
                  <td className="p-4">Complex conversational flows & existing chains</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Wallet Integration</td>
                  <td className="p-4 text-green-400">Native (Built-in)</td>
                  <td className="p-4">Via Adapter Wrapper</td>
                </tr>
                 <tr>
                  <td className="p-4 font-medium">Latency</td>
                  <td className="p-4 text-green-400">Ultra-low (Direct Edge)</td>
                  <td className="p-4">Standard</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">State Management</td>
                  <td className="p-4">Blockchain-synced</td>
                  <td className="p-4">Memory / Database</td>
                </tr>
                 <tr>
                  <td className="p-4 font-medium">Learning Curve</td>
                  <td className="p-4">Low (Type-safe SDK)</td>
                  <td className="p-4">Medium (Graph concepts)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const AgentsPage = () => {
    const [subTab, setSubTab] = useState<'DEPLOY' | 'EXPLORE'>('DEPLOY');
    const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'NAME' | 'COST' | 'DATE'>('NAME');

    // Filter Logic
    const filteredAgents = useMemo(() => {
      let agents = subTab === 'DEPLOY' ? MOCK_AGENTS.filter(a => a.owner.startsWith('0x123')) : MOCK_AGENTS;
      
      if (searchQuery) {
        agents = agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      return agents.sort((a, b) => {
        if (sortBy === 'NAME') return a.name.localeCompare(b.name);
        if (sortBy === 'COST') return a.costPerRequest - b.costPerRequest;
        if (sortBy === 'DATE') return new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime();
        return 0;
      });
    }, [subTab, searchQuery, sortBy]);

    if (view === 'CREATE') {
      return (
        <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
          <button 
            onClick={() => setView('LIST')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> <span>Back to Agents</span>
          </button>
          
          <div className="bg-surface border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Deploy New Agent</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">AGENT NAME</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white" placeholder="e.g. NeoTrader" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIPTION</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white h-24" placeholder="What does this agent do?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">COST PER REQUEST ($)</label>
                    <input type="number" step="0.01" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white" placeholder="0.05" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">DEPLOY URL</label>
                    <input type="url" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white" placeholder="https://..." />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">PROVIDER</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white">
                    <option>Gemini</option>
                    <option>OpenAI</option>
                    <option>Anthropic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">MODEL</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white">
                    <option>gemini-2.5-flash</option>
                    <option>gemini-pro-1.5</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="accent-primary w-4 h-4" />
                  <span className="text-sm text-gray-300">Multi-Agent System</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="accent-primary w-4 h-4" defaultChecked />
                  <span className="text-sm text-gray-300">Enable Streaming</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setView('LIST')} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                 <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm">Deploy Agent</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-6">
          <div>
             <h1 className="text-4xl font-bold mb-2">Agents</h1>
             <p className="text-gray-400">Manage your deployed agents or discover global talent.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
             {/* Search & Sort */}
             <div className="flex items-center bg-surface border border-white/10 rounded-lg px-3 py-2 w-full md:w-auto">
                <Search size={16} className="text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search agents..." 
                  className="bg-transparent outline-none text-sm w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex items-center bg-surface border border-white/10 rounded-lg px-3 py-2 space-x-2 cursor-pointer relative group">
                <SortAsc size={16} className="text-gray-500" />
                <span className="text-sm text-gray-300">{sortBy}</span>
                <div className="absolute top-full left-0 w-full bg-surface border border-white/10 rounded-lg mt-1 hidden group-hover:block z-20">
                   {['NAME', 'COST', 'DATE'].map(opt => (
                     <div 
                       key={opt} 
                       className="px-3 py-2 text-xs hover:bg-white/10 cursor-pointer text-gray-400 hover:text-white"
                       onClick={() => setSortBy(opt as any)}
                     >
                       {opt}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-surface border border-white/10 rounded-lg p-1 flex">
               <button 
                 onClick={() => setSubTab('DEPLOY')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'DEPLOY' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 My Agents
               </button>
               <button 
                 onClick={() => setSubTab('EXPLORE')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'EXPLORE' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Explore
               </button>
             </div>
             
             {subTab === 'DEPLOY' && (
               <button 
                 onClick={() => setView('CREATE')}
                 className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors whitespace-nowrap"
               >
                 <Plus size={16} /> <span>Create Agent</span>
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
             <div key={agent.id} className="group relative bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-white/20 transition-all">
                {/* Blur Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-surfaceHighlight border border-white/10 rounded-lg flex items-center justify-center">
                       <Globe size={20} className="text-gray-400" />
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-mono border ${agent.status === 'Active' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{agent.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-xs font-mono text-gray-500 mb-6">
                    <div>PROVIDER: <span className="text-gray-300">{agent.provider}</span></div>
                    <div>MODEL: <span className="text-gray-300">{agent.model}</span></div>
                    <div>TYPE: <span className="text-gray-300">{agent.type}</span></div>
                    <div>COST: <span className="text-gray-300">${agent.costPerRequest}/req</span></div>
                  </div>

                  {subTab === 'EXPLORE' ? (
                     <button className="w-full py-2 bg-primary/10 border border-primary/50 text-primary rounded-lg font-mono text-xs hover:bg-primary/20 transition-colors uppercase tracking-wider">
                       Register Agent
                     </button>
                  ) : (
                    <div className="flex space-x-2">
                       <button className="flex-1 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-mono text-xs hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                         <Edit size={12} /> <span>Edit</span>
                       </button>
                       <button className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                         <Trash2 size={14} />
                       </button>
                    </div>
                  )}
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  };

  const ApiKeysPage = () => {
    const [isCreating, setIsCreating] = useState(false);

    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">API Keys</h1>
        
        {/* Usage Overview Chart */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-lg">Usage Overview (Requests)</h3>
             <select className="bg-black border border-white/10 rounded px-3 py-1 text-xs outline-none">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                {name: 'Mon', reqs: 4000}, {name: 'Tue', reqs: 3000}, {name: 'Wed', reqs: 2000}, 
                {name: 'Thu', reqs: 2780}, {name: 'Fri', reqs: 1890}, {name: 'Sat', reqs: 2390}, {name: 'Sun', reqs: 3490}
              ]}>
                <defs>
                  <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF94" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} />
                <YAxis stroke="#666" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111', borderColor: '#333', color: '#fff'}} 
                  itemStyle={{color: '#00FF94'}}
                />
                <Area type="monotone" dataKey="reqs" stroke="#00FF94" fillOpacity={1} fill="url(#colorReqs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Area */}
        {isCreating ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Create New API Key</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-gray-500 font-mono mb-2 block">KEY NAME</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white" placeholder="e.g. Production Mobile App" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-3 block">PERMISSIONS</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Read Data', 'Write Data', 'Execute Agent', 'Admin Access'].map(perm => (
                    <label key={perm} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
                      <input type="checkbox" className="accent-primary w-4 h-4" />
                      <span className="text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                 <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm">Generate Secret Key</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-xl">Active Keys</h3>
               <div className="flex gap-4">
                 <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                   <input type="text" placeholder="Search keys..." className="bg-surface border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs w-48 focus:border-white/30 outline-none" />
                 </div>
                 <button 
                   onClick={() => setIsCreating(true)}
                   className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors"
                 >
                   <Plus size={16} /> <span>Create New Key</span>
                 </button>
               </div>
             </div>
             
             <div className="space-y-3">
               {MOCK_API_KEYS.map(key => (
                 <div key={key.id} className="bg-surface border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between hover:border-white/20 transition-colors group">
                   <div className="flex items-start gap-4 mb-4 md:mb-0 w-full md:w-auto">
                     <div className="w-10 h-10 rounded-lg bg-surfaceHighlight border border-white/5 flex items-center justify-center text-primary">
                        <Key size={20} />
                     </div>
                     <div>
                       <div className="font-bold text-sm text-white flex items-center gap-2">
                         {key.name}
                         <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-mono font-normal">
                           {key.prefix}
                         </span>
                       </div>
                       <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                         <span>Created {key.createdAt}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-700" />
                         <span>Last used {key.lastUsed}</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                     <div className="flex space-x-1 mr-4">
                        {Object.entries(key.permissions).map(([k, v]) => (
                          v && <span key={k} className="w-2 h-2 rounded-full bg-primary/50" title={k} />
                        ))}
                     </div>
                     <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Copy Key">
                       <Copy size={16} />
                     </button>
                     <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Permissions">
                       <Edit size={16} />
                     </button>
                     <button className="p-2 text-yellow-500/80 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors" title="Revoke Key">
                       <Ban size={16} />
                     </button>
                     <button className="p-2 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Key">
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    );
  };

  // --- WALLET PAGE (UPGRADED) ---
  const WalletPage = () => {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-screen">
        {!isWalletConnected ? (
           <div className="text-center space-y-4 py-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
             <div className="w-24 h-24 bg-surface border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_100px_rgba(0,255,148,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl opacity-50" />
                <Wallet size={40} className="text-primary relative z-10" />
             </div>
             <h2 className="text-3xl font-bold">Connect to Dagent</h2>
             <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
               Access your decentralized portfolio. View staked agents, collect API yields, and manage your DAG token balance.
             </p>
             <button 
               onClick={() => setIsWalletConnected(true)}
               className="mt-8 bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl"
             >
               Connect Wallet
             </button>
           </div>
        ) : (
          <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
            
            {/* Wallet Header */}
            <div className="flex justify-between items-center bg-surface border border-white/10 p-6 rounded-2xl">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 border-2 border-white/20" />
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">CONNECTED AS</div>
                    <div className="font-mono font-bold text-lg flex items-center gap-2">
                      0x7F...3a9B 
                      <Copy size={14} className="text-gray-500 cursor-pointer hover:text-white" />
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => setIsWalletConnected(false)}
                 className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-colors"
               >
                 Disconnect
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Col: Balance Card */}
              <div className="lg:col-span-2 space-y-8">
                {/* Asset Card */}
                <div className="relative h-64 rounded-3xl overflow-hidden p-8 flex flex-col justify-between border border-white/10 shadow-2xl group">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black z-0" />
                   <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                   
                   <div className="relative z-10 flex justify-between items-start">
                      <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                        <span className="font-pixel text-primary">DA</span> 
                        DAGENT PROTOCOL
                      </div>
                      <CreditCard className="text-white/20" />
                   </div>

                   <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-2">TOTAL BALANCE</div>
                      <div className="text-5xl font-bold font-mono tracking-tighter text-white">
                        {walletStats.balance.toLocaleString()} <span className="text-2xl text-primary">DAG</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                        <TrendingUp size={16} /> +12.5% this week
                      </div>
                   </div>

                   <div className="relative z-10 flex gap-4 mt-4">
                      <button className="flex-1 bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                        Buy DAG
                      </button>
                      <button className="flex-1 bg-white/10 text-white py-2 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
                        Transfer
                      </button>
                   </div>
                </div>

                {/* Staking Section */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Layers size={18} className="text-secondary" /> Active Stakes
                      </h3>
                      <button className="text-xs text-primary hover:underline">View All</button>
                   </div>
                   <div className="space-y-4">
                      {MOCK_STAKES.map(stake => (
                        <div key={stake.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary">
                                <Zap size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{stake.agentName}</div>
                                <div className="text-xs text-green-400">{stake.apy}% APY</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="font-mono font-bold">{stake.amount.toLocaleString()} DAG</div>
                              <div className="text-xs text-gray-500">Earned: {stake.earned} DAG</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Right Col: History */}
              <div className="space-y-8">
                 <div className="bg-surface border border-white/10 rounded-2xl p-6 h-full">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <History size={18} className="text-gray-400" /> Recent Activity
                    </h3>
                    <div className="space-y-6">
                      {MOCK_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="relative pl-6 border-l border-white/10 pb-2 last:pb-0">
                           <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${tx.amount.startsWith('+') ? 'bg-green-500' : 'bg-gray-500'}`} />
                           <div className="flex justify-between items-start">
                             <div>
                               <div className="text-sm font-bold">{tx.type}</div>
                               <div className="text-xs text-gray-500">{tx.date}</div>
                             </div>
                             <div className={`font-mono text-sm ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                               {tx.amount}
                             </div>
                           </div>
                           <div className="text-[10px] text-gray-600 mt-1 uppercase">{tx.status}</div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 selection:text-white">
      <Header />
      
      <main className="relative">
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === Tab.HOME && <LandingPage />}
            {activeTab === Tab.FRAMEWORKS && <FrameworksPage />}
            {activeTab === Tab.AGENTS && <AgentsPage />}
            {activeTab === Tab.API_KEYS && <ApiKeysPage />}
            {activeTab === Tab.WALLET && <WalletPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;