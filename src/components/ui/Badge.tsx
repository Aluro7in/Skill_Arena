import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick
}) => {
  const variantClasses = {
    default: 'bg-gray-700 text-gray-300 border-gray-600',
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent',
    warning: 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-transparent',
    error: 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent',
    outline: 'bg-transparent text-gray-300 border-gray-600'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const MotionComponent = onClick ? motion.button : motion.span;

  return (
    <MotionComponent
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full border transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {children}
    </MotionComponent>
  );
};

export { Badge };