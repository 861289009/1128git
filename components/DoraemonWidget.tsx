import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import AIChat from './AIChat';
import { resolveImage } from '../assets/imageResolver';

const DoraemonWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatState, setChatState] = useState<'idle' | 'thinking' | 'finished'>('idle');

    // Scroll-driven transforms for arm retraction/extension
    const { scrollYProgress } = useScroll();
    const armX = useTransform(scrollYProgress, [0, 1], [40, 120]);
    const armY = useTransform(scrollYProgress, [0, 1], [0, 180]);
    const armScaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
    const armScale = useSpring(armScaleRaw, { stiffness: 240, damping: 16, mass: 0.9 });
    // Clip to a circle centered near the arm tip (right 75%) when near bottom
    // No clipping at top; near bottom only the tip ball remains
    const armClip = useTransform(scrollYProgress, [0, 0.85, 1], ['none', 'none', 'circle(18px at 100% 75%)']);
    // Label fades out near bottom as arm retracts
    const labelOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);

    const getBodyImage = () => {
        if (chatState === 'thinking') return resolveImage('duolaBmeng.webp');
        if (chatState === 'finished') return resolveImage('duolaCmeng.webp');
        return resolveImage('duolaAmeng.webp');
    };

    const handleClose = () => {
        setIsOpen(false);
        setChatState('idle');
    };

    return (
        <>
            {/* Arm Trigger - fixed at current position */}
            <div className="fixed right-0 top-[75%] -translate-y-1/2 z-50 flex flex-col items-end pointer-events-none">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            animate={{ rotate: [-1.5, 1.5, -1.5] }}
                            exit={{ x: '100%' }}
                            transition={{
                                rotate: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                            }}
                            style={{ transformOrigin: 'right 75%', x: armX, y: armY, scale: armScale, clipPath: armClip }}
                            className="relative cursor-pointer pointer-events-auto"
                            onClick={() => setIsOpen(true)}
                        >
                            <img
                                src={resolveImage('duolagebo.webp')}
                                alt="Doraemon Arm"
                                loading="eager"
                                decoding="async"
                                className="w-[clamp(120px,16vw,240px)] hover:scale-105 transition-transform drop-shadow-lg"
                            />
                            {/* Follow label under the arm - fades out on scroll */}
                            <motion.div
                                style={{ opacity: labelOpacity }}
                                className="absolute left-1/2 top-full -translate-x-1/2 mt-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-mono shadow pointer-events-none whitespace-nowrap"
                            >
                                点击打开AI助手
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Widget Area - fixed higher, no upward animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 z-50 flex flex-col items-end mr-4 pointer-events-auto"
                    >
                        {/* Doraemon Body - positioned slightly higher and fixed within dialog (non-interactive to allow clicks on chat) */}
                        <div className="relative z-10 mr-[-32px] transform translate-x-[-10px] translate-y-[35px] pointer-events-none">
                            <img
                                src={getBodyImage()}
                                alt="Doraemon"
                                loading="lazy"
                                decoding="async"
                                className="w-[clamp(220px,24vw,380px)] drop-shadow-2xl"
                            />
                        </div>

                        {/* Chat Area */}
                        <div className="w-[80vw] md:w-80 h-[400px] relative z-20">
                            <AIChat
                                embedded={true}
                                isOpen={true}
                                onClose={handleClose}
                                onStartThinking={() => setChatState('thinking')}
                                onFinishThinking={() => setChatState('finished')}
                                onInputChange={() => setChatState('idle')}
                                className="h-full shadow-2xl border-2 border-black/20 bg-white/95"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DoraemonWidget;
