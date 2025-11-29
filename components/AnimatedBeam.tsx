import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Code, Zap, Globe, Shield } from 'lucide-react';

export const AgentNetwork: React.FC = () => {
  const satellites = [
    { icon: Bot, color: '#00FF94', delay: 0 },
    { icon: Brain, color: '#9D00FF', delay: 1 },
    { icon: Code, color: '#3B82F6', delay: 2 },
    { icon: Zap, color: '#FFD700', delay: 0.5 },
    { icon: Globe, color: '#FF00FF', delay: 1.5 },
    { icon: Shield, color: '#00FFFF', delay: 2.5 },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center justify-center my-12">
      {/* Central Hub */}
      <div className="relative z-20 w-32 h-32 bg-black border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,148,0.3)]">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-slow"></div>
        <div className="text-center">
          <span className="block font-pixel text-xs text-primary mb-1">CORE</span>
          <span className="block font-bold text-white tracking-widest text-lg">DAGENT</span>
        </div>
      </div>

      {/* Orbiting Satellites */}
      {satellites.map((sat, i) => {
        const angle = (i * 360) / satellites.length;
        const radius = 160; // Distance from center
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <React.Fragment key={i}>
            {/* Connection Line */}
            <div 
              className="absolute top-1/2 left-1/2 h-[1px] bg-white/10 origin-left z-0"
              style={{
                width: radius,
                transform: `rotate(${angle}deg)`,
              }}
            >
               {/* Inward flowing beam */}
               <motion.div
                className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-transparent via-current to-transparent"
                style={{ color: sat.color }}
                animate={{ x: [-radius, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: sat.delay }}
               />
            </div>

            {/* Satellite Node */}
            <motion.div
              className="absolute w-12 h-12 bg-surfaceHighlight border border-white/10 rounded-xl flex items-center justify-center z-10 shadow-lg"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <sat.icon size={20} style={{ color: sat.color }} />
            </motion.div>
          </React.Fragment>
        );
      })}
      
      {/* Background Orbit Ring */}
      <div className="absolute inset-0 rounded-full border border-white/5 w-[320px] h-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
    </div>
  );
};