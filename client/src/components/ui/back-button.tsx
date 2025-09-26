import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  className = '',
  variant = 'ghost',
  size = 'sm'
}) => {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (to) {
      setLocation(to);
    } else {
      // Go back in history or to dashboard as fallback
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setLocation('/dashboard');
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <i className="fi fi-rr-arrow-small-left text-lg" />
      <span>Back</span>
    </Button>
  );
};