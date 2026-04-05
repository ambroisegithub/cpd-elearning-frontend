import React from 'react';

interface SmartButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SmartButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: SmartButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const variantStyles = {
    primary: 'bg-[#2D6A4F] text-white hover:bg-[#245A42]',
    secondary: 'bg-[#F8F9FA] text-[#1E2F5E] hover:bg-[#E9ECEF]',
    accent: 'bg-[#E76F51] text-white hover:bg-[#D55F41]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-full transition-all duration-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'all 0.1s cubic-bezier(0.34, 1.2, 0.64, 1)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
