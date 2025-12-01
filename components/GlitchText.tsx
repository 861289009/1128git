/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate overflow-visible pt-[2px] leading-[1.3] ${className}`}>
      {/* Main Gradient Text - Darker colors for white background */}
      <motion.span
        className="absolute inset-0 z-10 block bg-gradient-to-r from-black via-[#2d8a86] via-[#435585] via-[#2d8a86] to-black bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position]"
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {text}
      </motion.span>
      
      {/* Base layer for solid black/gray fallback */}
      <span 
        className="block text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 opacity-50"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}
      >
        {text}
      </span>
      
      {/* Blur Glow Effect - Reduced intensity for light mode */}
      <span
        className="absolute inset-0 -z-10 block bg-gradient-to-r from-[#a8fbd3] via-[#4fb7b3] via-[#637ab9] to-[#a8fbd3] bg-[length:200%_auto] bg-clip-text text-transparent blur-xl md:blur-2xl opacity-20"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)' 
        }}
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;
