import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWithOutlineProps {
  icon: LucideIcon;
  size?: number;
  color: string;
  className?: string;
}

export const IconWithOutline: React.FC<IconWithOutlineProps> = ({ 
  icon: Icon, 
  size = 28, 
  color,
  className = '' 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`} 
      style={{ 
        width: size, 
        height: size,
        willChange: 'transform',
        transform: 'translateZ(0)', // GPU acceleration
      }}
    >
      {/* Black outline layer - slightly larger and black */}
      <Icon 
        size={size + 4} 
        className="absolute"
        style={{ 
          color: '#000000',
          strokeWidth: 4,
          transform: 'translateZ(0)',
        }} 
      />
      {/* Colored icon on top */}
      <Icon 
        size={size} 
        className="relative"
        style={{ 
          color: color,
          filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 4px ${color})`,
          transform: 'translateZ(0)',
        }} 
      />
    </div>
  );
};

