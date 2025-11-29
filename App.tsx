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
  X,
  LogOut,
  User,
  Database,
  Network,
  Settings,
  Fuel,
  Clock,
  Hash,
  Menu,
  MoreVertical,
  Bell,
  Lock,
  Smartphone,
  Monitor,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, ApiKey, Tab, WalletStats } from './types';
import { MOCK_AGENTS, MOCK_API_KEYS, ADK_SNIPPET, LANGGRAPH_SNIPPET, MOCK_TRANSACTIONS, MOCK_STAKES } from './constants';
import { AgentNetwork } from './components/AnimatedBeam';

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: 6450.25,
    staked: 5000.00,
    earnings: 342.10,
    apy: 12.5
  });

  // Mock Cardano Wallets
  const CARDANO_WALLETS = [
    { name: 'Nami', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzMyRDc0QiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTMwLjUgMjBMMjAgMTAuNSA5LjUgMjAgMjAgMjkuNSAzMC41IDIwem0tNyAwbC0zLjUtMy41LTMuNSAzLjUgMy41IDMuNSAzLjUtMy41eiIvPjwvc3ZnPg==' },
    { name: 'Eternl', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzIyMjIyMiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI2QyY2MwNyIgZD0iTTIwIDVsMTAgMTBMMjAgMjUgMTAgMTVMMjAgNXptMCAyMmw2IDZMMjAgMzdsLTYtNmw2LTZ6Ii8+PC9zdmc+' },
    { name: 'Typhon', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzAwRDJGRiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEyIDEyaDE2djE2SDEyVjEyeiIvPjwvc3ZnPg==' },
    { name: 'Flint', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0ZGMzAzMCIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEwIDEwaDIwdjIwSDEwVjEweiIvPjwvc3ZnPg==' },
  ];

  const handleWalletConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowWalletSelector(false);
      setIsWalletConnected(true);
      // Stay on Home Page, but unlock UI
      setActiveTab(Tab.HOME);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setShowUserMenu(false);
    setActiveTab(Tab.HOME);
  };

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

  const Header = () => {
    if (!isWalletConnected) return null;

    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl animate-in fade-in slide-in-from-top-10 duration-500">
        <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl p-2 px-4 flex items-center justify-between shadow-2xl">
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
            {navItem(Tab.WALLET, 'Wallet', <Wallet size={16} />)}
            {navItem(Tab.API_KEYS, 'API Keys', <Key size={16} />)}
          </nav>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-surface border border-white/10 text-white hover:border-primary/50 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
              <div className="flex flex-col items-start leading-none">
                 <span className="font-bold text-[10px] text-gray-400">NeoDev</span>
                 <span className="font-mono text-xs text-primary">addr1...9sAd</span>
              </div>
              <ChevronRight size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
            </button>

            {showUserMenu && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  <button 
                    onClick={() => {
                        setActiveTab(Tab.SETTINGS);
                        setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                  >
                     <Settings size={16} /> Settings
                  </button>
                  <div className="h-[1px] bg-white/5 mx-2 my-1" />
                  <button 
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                     <LogOut size={16} /> Disconnect
                  </button>
               </div>
            )}
          </div>
        </div>
      </header>
    );
  };

  const Footer = () => (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
             <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
               <span className="font-pixel text-black text-[8px] font-bold">DA</span>
             </div>
             <span className="font-bold text-lg">dagent</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            The decentralized layer for autonomous AI agents. Built on Cardano & Masumi.
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
            <li><a href="#" className="hover:text-primary transition-colors">Masumi Network</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
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

  const WalletSelectionModal = () => {
    if (!showWalletSelector) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-beam" />
          <button 
            onClick={() => setShowWalletSelector(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold mb-2 text-center">Connect Wallet</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Select a Cardano wallet to continue.</p>

          {isConnecting ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <p className="text-sm font-mono text-primary animate-pulse">Establishing secure connection...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {CARDANO_WALLETS.map((wallet) => (
                <button 
                  key={wallet.name}
                  onClick={handleWalletConnect}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-lg" />
                    <span className="font-bold">{wallet.name}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00ff94]" />
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center text-xs text-gray-500">
            By connecting, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    );
  };

  const LandingPage = () => (
    <div className="min-h-screen flex flex-col w-full">
       {/* Top Right Connect Button (Only visible on Landing when not connected) */}
       {!isWalletConnected && (
         <div className="absolute top-6 right-6 z-50">
           <button 
             onClick={() => setShowWalletSelector(true)}
             className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center space-x-2 shadow-lg"
           >
             <Wallet size={16} className="text-primary" />
             <span>Connect with Cardano</span>
           </button>
         </div>
       )}

      <div className="pt-32 px-6 w-full space-y-24 flex-1">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-mono tracking-wider">CARDANO MAINNET LIVE</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-5xl mx-auto">
            Deploy Unstoppable <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Autonomous Agents</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            The first decentralized layer for AI sovereignty on Cardano. Powered by Masumi Network.
          </p>

          <AgentNetwork />

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            {!isWalletConnected ? (
              <button 
                onClick={() => setShowWalletSelector(true)}
                className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center space-x-2">
                  <span>Connect with Cardano</span>
                  <ArrowRight size={20} />
                </span>
              </button>
            ) : (
               <button 
                onClick={() => setActiveTab(Tab.AGENTS)}
                className="group relative px-8 py-4 bg-primary text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,148,0.4)]"
              >
                <span className="relative flex items-center space-x-2">
                  <span>Explore Agents</span>
                  <ArrowRight size={20} />
                </span>
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab(Tab.FRAMEWORKS)}
              className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
            >
              Read Documentation
            </button>
          </div>
        </section>

        {/* Masumi & Based Agents Section */}
        <section className="py-20 w-full bg-gradient-to-b from-transparent to-black/40">
           <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4">Powered by Masumi</h2>
               <p className="text-gray-400 max-w-2xl mx-auto">Leveraging the Masumi Network for verifiable data availability and computation logs, ensuring every agent action is immutable and transparent.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-16 h-16 bg-surfaceHighlight border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(157,0,255,0.2)]">
                         <Database size={32} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Masumi Data Layer</h3>
                        <p className="text-gray-400">Agents store execution proofs directly on the Masumi Network, creating a trustless audit trail for every inference request.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-16 h-16 bg-surfaceHighlight border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                         <Check size={32} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">"Based" Agents</h3>
                        <p className="text-gray-400">Our "Based" standard ensures agents conform to strict on-chain behavioral protocols, guaranteeing they are autonomous, non-custodial, and verifiable.</p>
                      </div>
                   </div>
                </div>
                
                <div className="relative h-[400px] bg-surfaceHighlight/30 border border-white/5 rounded-3xl overflow-hidden p-8 flex items-center justify-center">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                   <div className="relative z-10 text-center">
                      <div className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-mono mb-4">MASUMI PROTOCOL</div>
                      <div className="text-5xl font-bold mb-2 tracking-tighter">100%</div>
                      <div className="text-gray-400">Verifiable Computation</div>
                   </div>
                   {/* Decorative rings */}
                   <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                   <div className="absolute w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>
             </div>
           </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </section>
      </div>
    </div>
  );

  // --- FRAMEWORKS PAGE (UPGRADED LAYOUT) ---
  const FrameworksPage = () => {
    const [selectedFramework, setSelectedFramework] = useState<'ADK' | 'LangGraph'>('ADK');
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    useEffect(() => {
      setTerminalLines([]);
      const lines = [
        `> Initializing ${selectedFramework} environment...`,
        `> Loading configuration...`,
        `> Connecting to Dagent Network (Cardano)...`,
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
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Developer <span className="text-primary">Console</span></h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              The complete toolkit for building autonomous agents on Cardano.
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

        {/* TOP ROW: Resources & Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 h-[500px]">
           {/* Left: Developer Resources */}
           <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="font-bold mb-6 flex items-center gap-2 text-2xl">
                  <Box size={24} className="text-secondary" /> 
                  Developer Resources
                </h4>
                <p className="text-gray-400 mb-8">
                  Get up and running with the {selectedFramework} in minutes. We provide comprehensive documentation, examples, and community support.
                </p>
                <div className="space-y-4">
                  <div className="bg-[#050505] border border-white/10 rounded-lg p-5 flex items-center justify-between group">
                    <code className="text-gray-300 font-mono text-sm">
                      <span className="text-secondary">$</span> bun add @dagent/{selectedFramework.toLowerCase()}
                    </code>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                  <ul className="space-y-2 text-sm mt-4">
                    <li className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/5">
                      <span className="flex items-center gap-3"><BookOpen size={16}/> Full API Reference</span>
                      <ArrowRight size={14} />
                    </li>
                    <li className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/5">
                      <span className="flex items-center gap-3"><Github size={16}/> Github Repository</span>
                      <ArrowRight size={14} />
                    </li>
                  </ul>
                </div>
              </div>
              <button className="w-full bg-white text-black px-4 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm uppercase tracking-wider">
                Read Documentation
              </button>
           </div>

           {/* Right: Code */}
           <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
             <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5 justify-between shrink-0">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs font-mono text-gray-500">
                   {selectedFramework === 'ADK' ? 'src/main.ts' : 'src/graph.ts'}
                </span>
                <Copy size={14} className="text-gray-500 hover:text-white cursor-pointer" />
             </div>
             <div className="p-6 overflow-auto custom-scrollbar flex-1">
               <pre className="font-mono text-sm leading-relaxed text-gray-300">
                 {selectedFramework === 'ADK' ? ADK_SNIPPET : LANGGRAPH_SNIPPET}
               </pre>
             </div>
           </div>
        </div>

        {/* BOTTOM ROW: Features & Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Features Grid */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: "Instant Deploy", desc: "One command deployment." },
                { icon: Shield, title: "Wallet Built-in", desc: "Non-custodial secure wallet." },
                { icon: Layers, title: "State Mgmt", desc: "Persistent on-chain memory." },
                { icon: Globe, title: "Global API", desc: "High-performance access." },
              ].map((item, i) => (
                <div key={i} className="bg-surface border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon size={20} className="text-primary" />
                    <h4 className="font-bold text-base">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
           </div>

           {/* Terminal */}
           <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 font-mono text-sm relative overflow-hidden shadow-lg min-h-[250px]">
              <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 flex items-center px-4 space-x-2">
                 <Terminal size={12} className="text-gray-500" />
                 <span className="text-xs text-gray-500">Dagent CLI</span>
              </div>
              <div className="mt-8 space-y-2">
                <div className="text-gray-400">$ dagent deploy --network cardano-mainnet</div>
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
              </div>
           </div>
        </div>
      </div>
    );
  };

  const AgentsPage = () => {
    // Default to EXPLORE
    const [subTab, setSubTab] = useState<'EXPLORE' | 'DEPLOY'>('EXPLORE');
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
          
          <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            
            <h3 className="text-2xl font-bold mb-6 relative z-10">Deploy New Agent</h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">AGENT NAME</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="e.g. NeoTrader" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIPTION</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white h-24 transition-colors resize-none" placeholder="What does this agent do?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">COST PER REQUEST ($)</label>
                    <input type="number" step="0.01" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="0.05" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">DEPLOY URL</label>
                    <input type="url" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="https://..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">PROVIDER</label>
                    <div className="relative">
                      <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white appearance-none transition-colors cursor-pointer">
                        <option>Gemini</option>
                        <option>OpenAI</option>
                        <option>Anthropic</option>
                        <option>Mistral</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">MODEL</label>
                     <div className="relative">
                      <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white appearance-none transition-colors cursor-pointer">
                        <option>gemini-2.5-flash</option>
                        <option>gemini-pro-1.5</option>
                        <option>gpt-4o</option>
                        <option>claude-3-opus</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-4 border-t border-white/5">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border border-white/20 rounded bg-black/50 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Multi-Agent System</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-5 h-5 border border-white/20 rounded bg-black/50 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Enable Streaming</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setView('LIST')} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                 <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm shadow-[0_0_15px_rgba(0,255,148,0.3)]">Deploy Agent</button>
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
             <h1 className="text-4xl font-bold mb-2">Agents Marketplace</h1>
             <p className="text-gray-400">Discover and integrate verifiable autonomous agents.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
             {/* Search */}
             <div className="flex items-center bg-surface border border-white/10 rounded-lg px-3 py-2 w-full md:w-auto focus-within:border-white/30 transition-colors">
                <Search size={16} className="text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search agents..." 
                  className="bg-transparent outline-none text-sm w-48 text-white placeholder-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             {/* Tabs Swapped: Explore First */}
             <div className="bg-surface border border-white/10 rounded-lg p-1 flex">
               <button 
                 onClick={() => setSubTab('EXPLORE')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'EXPLORE' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Explore
               </button>
               <button 
                 onClick={() => setSubTab('DEPLOY')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'DEPLOY' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 My Agents
               </button>
             </div>
             
             {subTab === 'DEPLOY' && (
               <button 
                 onClick={() => setView('CREATE')}
                 className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors whitespace-nowrap shadow-[0_0_10px_rgba(0,255,148,0.2)]"
               >
                 <Plus size={16} /> <span>Create Agent</span>
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
             <div key={agent.id} className="group relative bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-white/20 transition-all flex flex-col h-full hover:shadow-2xl hover:shadow-primary/5">
                
                <div className="relative z-10 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-surfaceHighlight border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                       <Globe size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-mono border ${agent.status === 'Active' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{agent.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{agent.description}</p>
                  
                  {/* Detailed Blockchain Info */}
                  <div className="bg-black/30 rounded-xl p-3 mb-6 space-y-2 border border-white/5">
                     <div className="flex justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Fuel size={12}/> Est. Gas</span>
                        <span className="text-gray-300 font-mono">{(agent as any).gasFee || '0.1 ADA'}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Clock size={12}/> Block Time</span>
                        <span className="text-gray-300 font-mono">{(agent as any).blockTime || '20s'}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Hash size={12}/> Contract</span>
                        <span className="text-primary font-mono cursor-pointer hover:underline">{(agent as any).contractAddress || 'addr1...'}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-xs font-mono text-gray-500 mb-6">
                    <div>PROVIDER: <span className="text-gray-300">{agent.provider}</span></div>
                    <div>MODEL: <span className="text-gray-300">{agent.model}</span></div>
                  </div>
                </div>

                <div className="mt-auto">
                    {subTab === 'EXPLORE' ? (
                        <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
                          Integrate Agent <ArrowRight size={14} />
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
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen w-full" onClick={() => setActiveDropdown(null)}>
        <h1 className="text-4xl font-bold mb-8">API Keys</h1>
        
        {/* Full width Chart */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8 w-full shadow-lg">
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

        {/* Content Area - Full Width */}
        {isCreating ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl"
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
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                 <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm">Generate Secret Key</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 w-full">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-xl">Active Keys</h3>
               <button 
                 onClick={() => setIsCreating(true)}
                 className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors"
               >
                 <Plus size={16} /> <span>Create New Key</span>
               </button>
             </div>
             
             <div className="space-y-3">
               {MOCK_API_KEYS.map(key => (
                 <div key={key.id} className="bg-surface border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between hover:border-white/20 transition-colors group w-full shadow-md">
                   {/* Key Item content */}
                   <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-12 h-12 bg-surfaceHighlight border border-white/5 rounded-xl flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]">
                         <Key size={24}/>
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">{key.name}</div>
                        <div className="flex items-center gap-3">
                           <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">{key.prefix}</span>
                           <span className="text-xs text-gray-500">• Created {key.createdAt}</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right hidden md:block">
                         <div className="text-xs text-gray-500 mb-1">Last Used</div>
                         <div className="text-sm font-mono text-gray-300">{key.lastUsed}</div>
                      </div>

                      <div className="flex items-center gap-2 relative">
                         <button className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-colors">
                            <Copy size={14}/> <span>Copy</span>
                         </button>
                         
                         <div className="relative">
                            <button 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setActiveDropdown(activeDropdown === key.id ? null : key.id);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                               <MoreVertical size={20}/>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {activeDropdown === key.id && (
                                 <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 origin-top-right"
                                 >
                                    <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                       <Edit size={16} /> Edit Permissions
                                    </button>
                                    <button className="w-full text-left px-4 py-3 text-sm text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-2">
                                       <Ban size={16} /> Revoke Key
                                    </button>
                                    <div className="h-[1px] bg-white/5 mx-2 my-1" />
                                    <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                       <Trash2 size={16} /> Delete Permanently
                                    </button>
                                 </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsPage = () => {
    return (
       <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full min-h-screen">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400 mb-12">Manage your profile, preferences, and security settings.</p>
          
          <div className="space-y-12">
             {/* Profile Section */}
             <section className="bg-surface border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                      <User size={20} className="text-primary"/> Profile Information
                   </h2>
                   <button className="text-xs text-primary hover:underline">Edit Profile</button>
                </div>
                
                <div className="flex items-start gap-8">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 border-4 border-surface shadow-xl" />
                      <button className="absolute bottom-0 right-0 p-2 bg-surface border border-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                         <Edit size={14} />
                      </button>
                   </div>
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-xs font-mono text-gray-500 mb-1">DISPLAY NAME</label>
                         <input type="text" value="NeoDev" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30" readOnly/>
                      </div>
                      <div>
                         <label className="block text-xs font-mono text-gray-500 mb-1">EMAIL ADDRESS</label>
                         <input type="email" value="neo@dagent.io" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30" readOnly/>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-mono text-gray-500 mb-1">CONNECTED WALLET</label>
                         <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-lg p-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                            <span className="font-mono text-sm text-gray-300 flex-1">addr1q8...9sAd</span>
                            <button className="text-xs text-red-400 hover:text-red-300">Disconnect</button>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Notifications */}
             <section className="bg-surface border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Bell size={20} className="text-secondary"/> Notifications
                </h2>
                <div className="space-y-4">
                   {[
                      { title: "Deployment Status", desc: "Get notified when your agents are successfully deployed.", icon: Layers },
                      { title: "Staking Rewards", desc: "Weekly summaries of your earned yields.", icon: Wallet },
                      { title: "Security Alerts", desc: "Immediate alerts for any suspicious API usage.", icon: ShieldCheck },
                   ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                               <item.icon size={18} />
                            </div>
                            <div>
                               <div className="font-bold text-sm">{item.title}</div>
                               <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" defaultChecked={i === 0 || i === 2} />
                           <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                      </div>
                   ))}
                </div>
             </section>

             {/* Security */}
             <section className="bg-surface border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Lock size={20} className="text-accent"/> Security & Login
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex flex-col justify-between h-48">
                      <div>
                         <div className="flex items-center justify-between mb-4">
                            <ShieldCheck size={24} className="text-green-400" />
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">ENABLED</span>
                         </div>
                         <div className="font-bold mb-1">2-Factor Authentication</div>
                         <div className="text-sm text-gray-400">Your account is secured with Google Authenticator.</div>
                      </div>
                      <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">Configure</button>
                   </div>

                   <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex flex-col justify-between h-48">
                      <div>
                         <div className="flex items-center justify-between mb-4">
                            <Key size={24} className="text-yellow-400" />
                            <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">Last changed 30d ago</span>
                         </div>
                         <div className="font-bold mb-1">API Signing Key</div>
                         <div className="text-sm text-gray-400">Used to verify CLI deployments.</div>
                      </div>
                      <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">Rotate Key</button>
                   </div>
                </div>

                <div className="mt-8">
                   <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Active Sessions</h3>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border-b border-white/5">
                         <div className="flex items-center gap-3">
                            <Monitor size={18} className="text-gray-500"/>
                            <div>
                               <div className="text-sm font-bold">Chrome on macOS</div>
                               <div className="text-xs text-gray-500">London, UK • Active now</div>
                            </div>
                         </div>
                         <button className="text-xs text-gray-500 hover:text-white">Revoke</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border-b border-white/5">
                         <div className="flex items-center gap-3">
                            <Smartphone size={18} className="text-gray-500"/>
                            <div>
                               <div className="text-sm font-bold">Dagent Mobile App</div>
                               <div className="text-xs text-gray-500">London, UK • 2h ago</div>
                            </div>
                         </div>
                         <button className="text-xs text-gray-500 hover:text-white">Revoke</button>
                      </div>
                   </div>
                </div>
             </section>
          </div>
       </div>
    );
  };

  const WalletPage = () => {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
          <div className="flex justify-between items-end mb-8">
             <div>
                <h1 className="text-4xl font-bold mb-2">My Wallet</h1>
                <p className="text-gray-400">Manage your Dagent assets and stakes.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Balance Card */}
            <div className="lg:col-span-2 relative h-[300px] rounded-3xl overflow-hidden p-10 flex flex-col justify-between border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-black z-0" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <span className="font-pixel text-primary">DA</span> 
                    DAGENT PROTOCOL
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Mainnet
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-sm text-gray-400 mb-2">TOTAL BALANCE</div>
                  <div className="text-6xl font-bold font-mono tracking-tighter text-white">
                    {walletStats.balance.toLocaleString()} <span className="text-3xl text-primary">DAG</span>
                  </div>
                  <div className="flex items-center gap-4 text-green-400 text-sm mt-4">
                    <span className="bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                       <TrendingUp size={14} /> +12.5%
                    </span>
                    <span className="text-gray-500">~$7,892.45 USD</span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4 mt-4">
                  <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg">
                    Stake Tokens
                  </button>
                  <button className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md">
                    Transfer
                  </button>
                </div>
            </div>

            {/* Staking Summary */}
            <div className="bg-surface border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
               <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <Layers size={20} className="text-secondary"/> Staking Rewards
                  </h3>
                  <div className="space-y-6">
                     <div>
                        <div className="text-gray-500 text-xs mb-1">TOTAL STAKED</div>
                        <div className="text-2xl font-mono font-bold">{walletStats.staked.toLocaleString()} DAG</div>
                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                           <div className="bg-secondary w-[70%] h-full" />
                        </div>
                     </div>
                     <div>
                        <div className="text-gray-500 text-xs mb-1">UNCLAIMED REWARDS</div>
                        <div className="text-2xl font-mono font-bold text-primary">{walletStats.earnings.toLocaleString()} DAG</div>
                     </div>
                  </div>
               </div>
               <button className="w-full py-3 bg-secondary/10 border border-secondary/30 text-secondary rounded-xl font-bold text-sm hover:bg-secondary/20 transition-colors">
                  Claim Rewards
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Active Stakes List */}
             <div className="bg-surface border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-lg">Active Agent Stakes</h3>
                </div>
                <div className="space-y-4">
                   {MOCK_STAKES.map(stake => (
                     <div key={stake.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-surfaceHighlight rounded-lg flex items-center justify-center text-secondary">
                             <Zap size={20} />
                           </div>
                           <div>
                             <div className="font-bold text-sm">{stake.agentName}</div>
                             <div className="text-xs text-green-400 font-mono">{stake.apy}% APY</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="font-mono font-bold">{stake.amount.toLocaleString()} DAG</div>
                           <div className="text-xs text-gray-500">Earned: {stake.earned}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Activity Feed */}
             <div className="bg-surface border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-lg">Recent Activity</h3>
                   <button className="text-xs text-primary hover:underline">View Explorer</button>
                </div>
                <div className="space-y-6">
                   {MOCK_TRANSACTIONS.map((tx) => (
                     <div key={tx.id} className="relative pl-6 border-l border-white/10 pb-2 last:pb-0 group">
                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${tx.amount.startsWith('+') ? 'bg-green-500' : 'bg-gray-500'} group-hover:scale-125 transition-transform`} />
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold">{tx.type}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              {tx.date}
                              <span className="w-1 h-1 bg-gray-600 rounded-full" />
                              <span className="font-mono text-[10px] text-gray-600 truncate w-24">{(tx as any).hash}</span>
                            </div>
                          </div>
                          <div className={`font-mono text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                            {tx.amount}
                          </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <Header />
      
      {/* Global Wallet Selector */}
      <AnimatePresence>
        {showWalletSelector && <WalletSelectionModal />}
      </AnimatePresence>

      <main className="relative flex-1 flex flex-col w-full">
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col w-full"
          >
            {activeTab === Tab.HOME && <LandingPage />}
            {activeTab === Tab.FRAMEWORKS && <FrameworksPage />}
            {activeTab === Tab.AGENTS && <AgentsPage />}
            {activeTab === Tab.API_KEYS && <ApiKeysPage />}
            {activeTab === Tab.WALLET && <WalletPage />}
            {activeTab === Tab.SETTINGS && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;