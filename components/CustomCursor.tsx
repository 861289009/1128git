
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Initialize off-screen
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Direct tracking without spring delay for instant response
  const x = mouseX;
  const y = mouseY;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      // Check for common interactive elements
      const clickable = target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-hover="true"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';
      setIsHovering(!!clickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className={`relative flex items-center justify-center rounded-full overflow-hidden ${isHovering ? 'backdrop-invert' : ''}`}
        animate={{
          width: isHovering ? 80 : 20,
          height: isHovering ? 80 : 20,
          backgroundColor: isClicking ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.5)' : '#1e3a8a',
          borderWidth: isHovering ? '1px' : '2px',
          borderStyle: 'solid',
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Radial Blur Overlay - Only visible on hover */}
        {isHovering && (
          <div
            className="absolute inset-0 backdrop-blur-[4px]"
            style={{
              maskImage: 'radial-gradient(circle, transparent 40%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 100%)'
            }}
          />
        )}

        {/* Text inside cursor on hover */}
        <motion.span
          className="text-white text-[10px] font-bold tracking-[0.2em] uppercase absolute mix-blend-difference z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          VIEW
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
