import React from 'react';

/**
 * Reusable Cyber-Heist Button
 * @param {string} variant - 'primary' (blue), 'danger' (red), 'success' (green), or 'outline'
 * @param {boolean} isLoading - Shows a loading state
 * @param {function} onClick - Function to trigger on click
 */
export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) {
  
  // Base styles for the mechanical terminal feel
  const baseStyles = "relative font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  // Variant-specific neon styling
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] rounded-2xl px-8 py-4",
    danger: "bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-6 py-3 text-xs",
    success: "bg-green-600 hover:bg-green-500 text-black rounded-full px-10 py-4 shadow-[0_0_25px_rgba(34,197,94,0.4)]",
    outline: "bg-transparent border border-zinc-700 text-zinc-500 hover:border-white hover:text-white rounded-xl px-6 py-3 text-xs"
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Glitch effect overlay on hover (optional flair) */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </span>

      {/* Background scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-20" />
    </button>
  );
}