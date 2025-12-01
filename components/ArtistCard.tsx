/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Artist } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-black/10 bg-white cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.img 
          src={artist.image} 
          alt={artist.name} 
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.8, filter: 'grayscale(100%)' },
            hover: { scale: 1.05, opacity: 1, filter: 'grayscale(0%)' }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        {/* Dark overlay to ensure white text pops even on white theme */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-[#637ab9]/20 transition-colors duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none z-10 overflow-visible">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-white/50 px-2 py-1 rounded-full backdrop-blur-md text-white">
             {artist.day}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black rounded-full p-2 will-change-transform"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div>
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-3xl md:text-4xl font-bold uppercase text-white mix-blend-difference will-change-transform leading-[1.15] pt-1 md:pt-2"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {artist.name}
            </motion.h3>
          </div>
          <motion.p 
            className="text-sm font-medium uppercase tracking-widest text-[#a8fbd3] mt-2 will-change-transform drop-shadow-md"
            variants={{
              rest: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {artist.genre}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;
