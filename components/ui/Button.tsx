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
    primary: "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200",
    secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    outline: "bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
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