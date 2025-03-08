
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  // If the image fails to load, fall back to the ShieldCheck icon
  if (imageError) {
    return (
      <ShieldCheck 
        className={cn(sizeClasses[size], "text-safet-500", className)} 
      />
    );
  }
  
  return (
    <img 
      src="/lovable-uploads/88793530-8487-4155-b6c5-59e6e31d8ba9.png" 
      alt="SafeT-iD Logo" 
      className={cn(sizeClasses[size], className)}
      onError={() => setImageError(true)}
    />
  );
};

export default Logo;
