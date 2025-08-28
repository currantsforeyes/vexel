import React from 'react';

interface IconProps {
  svg: string;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ svg, className = "w-6 h-6", onClick }) => {
  return (
    <div 
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};