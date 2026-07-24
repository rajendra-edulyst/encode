import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    px-3 py-1.5 sm:px-4 sm:py-2 
    rounded-full border border-gray-700 
    transition duration-200 
    flex items-center gap-2 flex-wrap 
    text-sm sm:text-base text-gray-700 
    text-white hover:text-white dark:text-black
    bg-primary hover:bg-primary/90 
  `;

  return (
    <button
      className={clsx(baseStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
