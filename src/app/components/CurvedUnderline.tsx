import React from 'react';

interface CurvedUnderlineProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function CurvedUnderline({ children, color = '#2D6A4F', className = '' }: CurvedUnderlineProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span 
        className="absolute left-[10%] right-[10%] bottom-0 h-[3px] translate-y-2"
        style={{
          backgroundColor: color,
          borderRadius: '100%',
          transform: 'translateY(8px)',
        }}
      />
    </span>
  );
}
