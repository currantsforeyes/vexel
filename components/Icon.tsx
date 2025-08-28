
import React from 'react';

interface IconProps {
  svg: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ svg, className }) => {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
