/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';



const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#fafdff] via-[#e0f4fa] to-[#ffffff]">

      {/* Blob 1: Mint - Enhanced movement */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#a8fbd3] rounded-full mix-blend-multiply filter blur-[60px] opacity-60 will-change-transform"
        animate={{
          x: [0, 100, -60, 40, -100, 0],
          y: [0, -80, 60, -40, 80, 0],
          scale: [1, 1.4, 0.8, 1.3, 0.9, 1],
          rotate: [0, 90, -60, 30, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Teal - Enhanced movement */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[66vw] h-[53vw] bg-[#4fb7b3] rounded-full mix-blend-multiply filter blur-[60px] opacity-50 will-change-transform"
        animate={{
          x: [0, -120, 80, -60, 100, 0],
          y: [0, 100, -80, 60, -100, 0],
          scale: [1, 1.5, 0.7, 1.4, 0.85, 1],
          rotate: [0, -120, 60, -40, 80, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 3: Periwinkle - Enhanced movement */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[53vw] h-[53vw] bg-[#637ab9] rounded-full mix-blend-multiply filter blur-[60px] opacity-50 will-change-transform"
        animate={{
          x: [0, 140, -100, 80, -120, 0],
          y: [0, -120, 100, -80, 120, 0],
          scale: [1, 1.6, 0.75, 1.5, 0.85, 1],
          rotate: [0, 180, -120, 60, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 4: New Accent Blob - Cyan */}
      <motion.div
        className="absolute top-[50%] left-[50%] w-[40vw] h-[40vw] bg-[#5dd9c1] rounded-full mix-blend-multiply filter blur-[70px] opacity-40 will-change-transform"
        animate={{
          x: [0, -80, 60, -40, 80, 0],
          y: [0, 80, -60, 40, -80, 0],
          scale: [1, 1.3, 0.9, 1.2, 0.95, 1],
          rotate: [0, -90, 45, -30, 60, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply pointer-events-none"></div>

      {/* Subtle Blue Vignette to match gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#dceef5]/60 pointer-events-none" />

      {/* Fade to white at the bottom to match content */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default FluidBackground;