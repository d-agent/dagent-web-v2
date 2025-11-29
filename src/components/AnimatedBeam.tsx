"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Globe, Shield, Bot, Brain } from 'lucide-react';

interface AnimatedBeamProps {
  fromRef: React.RefObject<HTMLDivElement>;
  toRef: React.RefObject<HTMLDivElement>;
  color: string;
  delay?: number;
}

const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  fromRef,
  toRef,
  color,
  delay = 0
}) => {
  const [path, setPath] = React.useState<string>('');

  useEffect(() => {
    const updatePath = () => {
      if (!fromRef.current || !toRef.current || !fromRef.current.parentElement) return;

      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();
      const containerRect = fromRef.current.parentElement.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;

      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const curvature = 30;

      const newPath = `M ${fromX} ${fromY} Q ${midX} ${midY - curvature} ${toX} ${toY}`;
      setPath(newPath);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    const interval = setInterval(updatePath, 100);

    return () => {
      window.removeEventListener('resize', updatePath);
      clearInterval(interval);
    };
  }, [fromRef, toRef]);

  if (!path) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${color.replace('#', '')}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />

      <motion.path
        d={path}
        fill="none"
        stroke={`url(#gradient-${color.replace('#', '')})`}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#glow-${color.replace('#', '')})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          pathLength: { duration: 3, repeat: Infinity, ease: "linear", delay },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
        }}
        style={{
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
    </svg>
  );
};

export const CoreAgentNetwork: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(React.RefObject<HTMLDivElement>)[]>([]);

  const tools = [
    { icon: Code, name: 'API', side: 'left', position: 0, color: '#3B82F6' },
    { icon: Brain, name: 'AI', side: 'left', position: 1, color: '#9D00FF' },
    { icon: Zap, name: 'Speed', side: 'left', position: 2, color: '#FFD700' },
    { icon: Shield, name: 'Security', side: 'right', position: 0, color: '#00FFFF' },
    { icon: Globe, name: 'Network', side: 'right', position: 1, color: '#FF00FF' },
    { icon: Bot, name: 'Agents', side: 'right', position: 2, color: '#00FF94' },
  ];

  tools.forEach((_, i) => {
    if (!nodeRefs.current[i]) {
      nodeRefs.current[i] = React.createRef<HTMLDivElement>();
    }
  });

  const horizontalSpacing = 350;
  const verticalSpacing = 90;

  return (
    <div className="relative w-full flex items-center justify-center my-16">
      <div className="relative w-full max-w-6xl h-[400px]" style={{ marginLeft: 'auto', marginRight: 'auto', transform: 'translateX(-50px)' }}>
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {tools.map((tool, i) => (
            <AnimatedBeam
              key={i}
              fromRef={nodeRefs.current[i]}
              toRef={centerRef}
              color={tool.color}
              delay={i * 0.15}
            />
          ))}

          {tools.map((tool, i) => {
            const x = tool.side === 'left' ? -horizontalSpacing : horizontalSpacing;
            const y = (tool.position - 1) * verticalSpacing;

            return (
              <motion.div
                key={i}
                ref={nodeRefs.current[i]}
                className="absolute z-20"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: i * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <div
                  className="relative w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center group hover:scale-110 transition-transform"
                  style={{
                    boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px ${tool.color}40`,
                  }}
                >
                  <tool.icon size={28} style={{ color: tool.color }} strokeWidth={2} />
                </div>
              </motion.div>
            );
          })}

          <motion.div
            ref={centerRef}
            className="absolute z-30"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 150,
              damping: 12,
            }}
          >
            <div
              className="relative w-28 h-28 rounded-full bg-black border border-white/20 flex flex-col items-center justify-center"
              style={{
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px rgba(0, 255, 148, 0.4)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-full"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="text-center relative z-10">
                <span className="block font-pixel text-[8px] text-white mb-0.5 leading-tight tracking-wider">
                  CORE
                </span>
                <span className="block font-pixel text-[10px] text-primary leading-tight tracking-wider">
                  DAGENT
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
