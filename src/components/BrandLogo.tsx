import React from 'react';
import logoC from '../assets/images/logoC.png';
import logoO from '../assets/images/logoO.png';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-9',
    md: 'h-22 sm:h-24',
    lg: 'h-14',
  };

  return (
    <div className={`inline-flex items-center select-none p-1 ${className}`}>
      <img
        src={variant === 'light' ? logoO : logoC}
        alt="Karisma Face & Body"
        className={`${heightClasses[size]} w-auto object-contain`}
      />
    </div>
  );
};