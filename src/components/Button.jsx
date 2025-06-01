import React from 'react';

const Button = ({ onClick, className = '', children, ...props }) => (
  <button
    onClick={onClick}
    className={`h-16 rounded-xl font-medium text-lg transition-all duration-200 
               bg-white/20 backdrop-blur-sm border border-white/10 text-white
               hover:bg-white/30 hover:-translate-y-1 hover:shadow-lg
               active:translate-y-0 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;