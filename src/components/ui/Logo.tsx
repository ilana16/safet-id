
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  return (
    <img 
      src="/lovable-uploads/88793530-8487-4155-b6c5-59e6e31d8ba9.png" 
      alt="SafeT-iD Logo" 
      className={cn(sizeClasses[size], className)}
    />
  );
};

export default Logo;
