
import React from 'react';
import { LucideIcon } from 'lucide-react';
import GradientText from './GlitchText';
import { motion, AnimatePresence } from 'framer-motion';

export interface SlideData {
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  features: Feature[];
  image: string;
  number: string;
  label: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  desc?: string;
  table?: {
    headers: string[];
    rows: string[][];
    columnWidths?: string[];
  };
  link?: {
    href: string;
    label?: string;
  };
}

interface FeatureSectionProps {
  id: string;
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  features: Feature[];
  image: string;
  number: string;
  label: string;
  isReversed?: boolean;
  layoutVariant?: 'standard' | 'stacked' | 'split';
  slides?: SlideData[];
  // Optional extra classes for the outer section to adjust spacing
  containerClassName?: string;
  // Control overlay (number/label) alignment on image: left or right
  overlayAlign?: 'left' | 'right';
  // Control carousel arrows visibility when using slides
  showArrows?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  id,
  titlePrefix,
  titleSuffix,
  description,
  features,
  image,
  number,
  label,
  isReversed = false,
  layoutVariant = 'standard',
  slides,
  containerClassName,
  overlayAlign = 'left',
  showArrows = true,
}) => {
  // Carousel Layout (for Beyond Reality) - CHECK THIS FIRST
  if (slides && slides.length > 0) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);

    const paginate = (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    const currentSlide = slides[currentIndex];

    // Dissipation / Particle Simulation Variants
    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        scale: 0.9,
        filter: "blur(20px)",
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
      }),
    };

    return (
      <section id={id} className={`relative z-10 py-20 md:py-32 overflow-visible min-h-[800px] ${containerClassName || ''}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative h-full">

          {/* Navigation Arrows (optional) */}
          {showArrows && slides.length > 1 && (
            <>
              <button
                className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-gradient-to-br from-[#4fb7b3]/60 to-[#637ab9]/60 backdrop-blur-xl border border-white/20 text-white hover:scale-110 hover:shadow-xl hover:shadow-[#4fb7b3]/30 transition-all duration-300 pointer-events-auto"
                onClick={() => paginate(-1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-gradient-to-br from-[#4fb7b3]/60 to-[#637ab9]/60 backdrop-blur-xl border border-white/20 text-white hover:scale-110 hover:shadow-xl hover:shadow-[#4fb7b3]/30 transition-all duration-300 pointer-events-auto"
                onClick={() => paginate(1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </>
          )}

          <div className="relative h-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={`slide-${currentIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -10000) {
                    paginate(1);
                  } else if (swipe > 10000) {
                    paginate(-1);
                  }
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
                  {/* Text Content */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'} order-1`}>
                    <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight text-black">
                      {currentSlide.titlePrefix} <br /> <GradientText text={currentSlide.titleSuffix} className="text-5xl md:text-8xl" />
                    </h2>
                    <p className="text-lg md:text-xl text-black/80 mb-8 md:mb-12 font-semibold leading-relaxed">
                      {currentSlide.description}
                    </p>

                    <div className="space-y-6 md:space-y-8">
                      {currentSlide.features.map((feature, i) => (
                        <div key={`${feature.title}-${i}`} className="flex items-start gap-6">
                          <div className="p-4 rounded-2xl bg-black/5 backdrop-blur-md border border-black/5">
                            <feature.icon className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading text-black">{feature.title}</h4>
                            {feature.table ? (
                              <div className="mt-2 overflow-x-auto rounded-xl border border-black/10 bg-white/50">
                                <table className="w-full table-fixed text-xs md:text-sm text-black/70">
                                  {feature.table.columnWidths && (
                                    <colgroup>
                                      {feature.table.headers.map((_, idx) => (
                                        <col key={`col-${idx}-${feature.table?.headers?.[idx] ?? ''}`} style={{ width: feature.table?.columnWidths?.[idx] || 'auto' }} />
                                      ))}
                                    </colgroup>
                                  )}
                                  <thead className="bg-white/60">
                                    <tr>
                                      {feature.table.headers.map((h, idx) => (
                                        <th key={`head-${idx}-${h}`} className="px-3 py-2 text-left font-bold tracking-wide text-black/70">
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {feature.table.rows.map((row, rIdx) => (
                                      <tr key={`row-${rIdx}-${row.join('|')}`} className="odd:bg-white/40 even:bg-white/30">
                                        {row.map((cell, cIdx) => (
                                          <td key={`cell-${rIdx}-${cIdx}-${cell}`} className="px-3 py-2 whitespace-nowrap">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <>
                                {feature.desc && (
                                  <p className="text-[0.95rem] md:text-base text-black/80 font-semibold whitespace-pre-line">
                                    {feature.desc}
                                  </p>
                                )}
                                {feature.link && (
                                  <a
                                    href={feature.link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2d8a86] font-semibold underline underline-offset-2"
                                  >
                                    {feature.link.label || feature.link.href}
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className={`lg:col-span-7 relative h-[400px] md:h-[700px] w-full ${isReversed ? 'lg:order-1' : 'lg:order-2'} order-2`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-3 opacity-30 blur-xl" />
                    <div className="relative h-full w-full rounded-3xl overflow-hidden border border-black/10 group shadow-2xl">
                      <img
                        src={currentSlide.image}
                        alt={currentSlide.titleSuffix}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                      <div className={`absolute md:bottom-10 bottom-6 ${overlayAlign === 'right' ? 'right-6 md:right-10 text-right' : 'left-6 md:left-10 text-left'}`}>
                        <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-70">
                          {currentSlide.number}
                        </div>
                        <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                          {currentSlide.label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Standard Layout (original)
  if (layoutVariant === 'standard') {
    return (
      <section id={id} className={`relative z-10 py-20 md:py-32 overflow-hidden ${containerClassName || ''}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'} order-2`}
            >
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight text-black">
                {titlePrefix} <br /> <GradientText text={titleSuffix} className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-black/80 mb-8 md:mb-12 font-semibold leading-relaxed">
                {description}
              </p>

              <div className="space-y-6 md:space-y-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={`${feature.title}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-black/5 backdrop-blur-md border border-black/5">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading text-black">{feature.title}</h4>
                      <>
                        {feature.desc && (
                          <p className="text-[0.95rem] md:text-base text-black/80 font-semibold whitespace-pre-line">
                            {feature.desc}
                          </p>
                        )}
                        {feature.link && (
                          <a
                            href={feature.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2d8a86] font-semibold underline underline-offset-2"
                          >
                            {feature.link.label || feature.link.href}
                          </a>
                        )}
                      </>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: isReversed ? -50 : 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`lg:col-span-7 relative h-[400px] md:h-[700px] w-full ${isReversed ? 'lg:order-1' : 'lg:order-2'} order-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-black/10 group shadow-2xl">
                <img
                  src={image}
                  alt={titleSuffix}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                <div className={`absolute md:bottom-10 bottom-6 ${overlayAlign === 'right' ? 'right-6 md:right-10 text-right' : 'left-6 md:left-10 text-left'}`}>
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-70">
                    {number}
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    {label}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Stacked Vertical Layout - Adjusted to match height
  if (layoutVariant === 'stacked') {
    return (
      <section id={id} className={`relative z-10 py-20 md:py-32 overflow-hidden ${containerClassName || ''}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <div className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-black/20 to-black/5 mb-4">
                {number}
              </div>
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 leading-tight text-black">
                {titlePrefix} <br /> <GradientText text={titleSuffix} className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-black/80 mb-8 font-semibold leading-relaxed">
                {description}
              </p>

              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={`${feature.title}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/60 backdrop-blur-md border border-black/10 rounded-2xl p-5 hover:border-[#4fb7b3]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-black/5">
                        <feature.icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1 font-heading text-black">{feature.title}</h4>
                        <>
                          {feature.desc && (
                            <p className="text-[0.95rem] md:text-base text-black/80 font-semibold whitespace-pre-line">
                              {feature.desc}
                            </p>
                          )}
                          {feature.link && (
                            <a
                              href={feature.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2d8a86] font-semibold underline underline-offset-2"
                            >
                              {feature.link.label || feature.link.href}
                            </a>
                          )}
                        </>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative h-[500px] md:h-[700px] order-1 lg:order-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4fb7b3] to-[#637ab9] rounded-3xl rotate-3 opacity-20 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-black/10 group shadow-2xl">
                <img
                  src={image}
                  alt={titleSuffix}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-black uppercase tracking-wider">{label}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Split Asymmetric Layout - Adjusted to consistent height
  if (layoutVariant === 'split') {
    return (
      <section id={id} className={`relative z-10 py-20 md:py-32 overflow-hidden ${containerClassName || ''}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-7 order-1"
            >
              <div className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] opacity-20 blur-xl" />
                <img
                  src={image}
                  alt={titleSuffix}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-6 left-6 md:top-10 md:left-10">
                  <div className="text-6xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-70">
                    {number}
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-black uppercase tracking-wider">{label}</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2"
            >
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 leading-tight text-black">
                {titlePrefix} <br /> <GradientText text={titleSuffix} className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-black/80 mb-8 font-semibold leading-relaxed">
                {description}
              </p>

              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-black/5 hover:bg-white/60 transition-colors"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#4fb7b3]/20 to-[#637ab9]/20 border border-black/5">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-bold mb-1 font-heading text-black">{feature.title}</h4>
                      <>
                        {feature.desc && (
                          <p className="text-[0.95rem] md:text-base text-black/80 font-semibold whitespace-pre-line">
                            {feature.desc}
                          </p>
                        )}
                        {feature.link && (
                          <a
                            href={feature.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2d8a86] font-semibold underline underline-offset-2"
                          >
                            {feature.link.label || feature.link.href}
                          </a>
                        )}
                      </>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default FeatureSection;
