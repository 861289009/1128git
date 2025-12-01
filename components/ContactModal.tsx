
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, Mail, Phone, MessageCircle } from 'lucide-react';

export interface ContactInfo {
    label: string;
    value: string;
    type: 'email' | 'phone' | 'qq' | 'wechat';
}

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    contacts: ContactInfo[];
    color?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    contacts,
    color = '#4fb7b3' // Default teal accent
}) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail className="w-8 h-8 text-white" />;
            case 'phone': return <Phone className="w-8 h-8 text-white" />;
            case 'qq':
            case 'wechat': return <MessageCircle className="w-8 h-8 text-white" />;
            default: return <Mail className="w-8 h-8 text-white" />;
        }
    };

    // Determine gradient based on color prop or default
    const getGradient = () => {
        if (color === 'teal') return 'from-[#4fb7b3] to-[#2d8a86]';
        if (color === 'periwinkle') return 'from-[#637ab9] to-[#435585]';
        return 'from-[#4fb7b3] to-[#637ab9]'; // Default mixed
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Ambient Background Gradient */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4fb7b3]/10 via-transparent to-[#637ab9]/10 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-black/60 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center mb-6 shadow-lg opacity-90`}>
                                {getIcon(contacts[0]?.type || 'email')}
                            </div>

                            <h3 className="text-2xl font-heading font-bold text-black mb-2">
                                {title}
                            </h3>
                            <p className="text-black/60 mb-8 text-sm">
                                {message}
                            </p>

                            <div className="w-full space-y-3">
                                {contacts.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="w-full bg-white border border-black/5 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm group hover:border-black/10 transition-colors"
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-xs text-black/40 font-mono uppercase tracking-wider mb-1">{contact.label}</span>
                                            <span className="text-black font-medium font-mono text-sm md:text-base break-all">{contact.value}</span>
                                        </div>

                                        <button
                                            onClick={() => handleCopy(contact.value, index)}
                                            className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${copiedIndex === index
                                                    ? 'bg-[#a8fbd3] text-[#2d8a86]'
                                                    : 'bg-black/5 text-black/60 hover:bg-black hover:text-white'
                                                }`}
                                            title="Copy to clipboard"
                                        >
                                            {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {copiedIndex !== null && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-2 text-xs font-bold text-[#2d8a86] bg-[#a8fbd3]/20 px-3 py-1 rounded-full"
                                >
                                    Copied to clipboard!
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
