"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Code, Zap, Globe, Shield } from 'lucide-react';
import { IconWithOutline } from './IconWithOutline';

export const AgentNetwork: React.FC = () => {
  const satellites = [
    { icon: Globe, color: '#FF00FF', delay: 0 },
    { icon: Shield, color: '#00FFFF', delay: 0.5 },
    { icon: Bot, color: '#00FF94', delay: 1 },
    { icon: Brain, color: '#9D00FF', delay: 1.5 },
    { icon: Code, color: '#3B82F6', delay: 2 },
    { icon: Zap, color: '#FFD700', delay: 2.5 },
  ];

  const circleRadius = 64; // Half of 128px (w-32 h-32 = 128px)
  const satelliteRadius = 160; // Distance from center to satellites

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center justify-center my-12">
      {/* Orbiting Satellites - Outside */}
      {satellites.map((sat, i) => {
        const angle = (i * 360) / satellites.length;
        const x = Math.cos((angle * Math.PI) / 180) * satelliteRadius;
        const y = Math.sin((angle * Math.PI) / 180) * satelliteRadius;
        const innerX = Math.cos((angle * Math.PI) / 180) * circleRadius;
        const innerY = Math.sin((angle * Math.PI) / 180) * circleRadius;

        const lineLength = satelliteRadius - circleRadius;
        const lineCenterX = (x + innerX) / 2;
        const lineCenterY = (y + innerY) / 2;
        
        return (
          <React.Fragment key={i}>
            {/* Connection Line - From satellite to circle edge */}
            <div
              className="absolute h-[1px] origin-left z-0"
              style={{
                width: lineLength,
                left: `calc(50% + ${innerX}px)`,
                top: `calc(50% + ${innerY}px)`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 50%',
              }}
            >
              {/* Static connection line */}
              <div 
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-l opacity-20"
                style={{ 
                  background: `linear-gradient(to left, transparent, ${sat.color})`
                }}
              />
              
              {/* Flowing beam animation */}
              <motion.div
                className="absolute top-0 right-0 h-full bg-gradient-to-l opacity-70"
                style={{ 
                  background: `linear-gradient(to left, transparent, ${sat.color}, transparent)`,
                  width: '60px',
                }}
                animate={{ 
                  x: [0, -lineLength],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear", 
                  delay: sat.delay 
                }}
              />
            </div>

            {/* Inner connection lines inside circle */}
            <div
              className="absolute top-1/2 left-1/2 h-[1px] origin-left z-5"
              style={{
                width: circleRadius * 0.7,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 50%',
              }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r opacity-80"
                style={{ 
                  background: `linear-gradient(to right, transparent, ${sat.color}, transparent)`
                }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: sat.delay }}
              />
            </div>

            {/* Satellite Node - With black outline for aesthetic look */}
            <motion.div
              className="absolute flex items-center justify-center z-10"
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
              transition={{ delay: i * 0.1 }}
            >
              <IconWithOutline 
                icon={sat.icon} 
                size={28} 
                color={sat.color}
              />
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Central Hub */}
      <div className="relative z-20 w-32 h-32 bg-black border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,148,0.3)] overflow-hidden">
        {/* Animated inner glow */}
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-slow"></div>
        
        {/* Inner connection lines container */}
        <div className="absolute inset-0 rounded-full">
          {satellites.map((sat, i) => {
            const angle = (i * 360) / satellites.length;
            const innerX = Math.cos((angle * Math.PI) / 180) * (circleRadius * 0.6);
            const innerY = Math.sin((angle * Math.PI) / 180) * (circleRadius * 0.6);
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `calc(50% + ${innerX}px)`,
                  top: `calc(50% + ${innerY}px)`,
                  backgroundColor: sat.color,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 8px ${sat.color}`,
                }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: sat.delay 
                }}
              />
            );
          })}
        </div>

        {/* Text Content */}
        <div className="text-center relative z-10">
          <span className="block font-pixel text-[8px] text-primary mb-0.5 leading-tight">CORE</span>
          <span className="block font-pixel text-[10px] text-white leading-tight tracking-wider">DAGENT</span>
        </div>
      </div>

      {/* Background Orbit Ring */}
      <div className="absolute inset-0 rounded-full border border-white/5 w-[320px] h-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
    </div>
  );
};