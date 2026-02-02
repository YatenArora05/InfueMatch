import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 rounded-xl";
  
  const variants = {
    primary: "bg-[#3B82F6] text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-blue-900/40",
    secondary: "bg-[#0B1120] text-[#3B82F6] hover:bg-[#111827] border border-[#1F2937]",
    outline: "bg-transparent border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#0B1120]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}