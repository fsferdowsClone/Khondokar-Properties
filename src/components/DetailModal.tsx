import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, BedDouble, Maximize, Calendar, Tag } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  content: React.ReactNode;
  metadata?: {
    location?: string;
    price?: string;
    details?: string;
    category?: string;
    date?: string;
  };
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  image, 
  content,
  metadata 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-surface rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-accent-gold transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {metadata?.price && (
                <div className="absolute bottom-6 left-6 glass px-6 py-3 rounded-xl border-accent-gold/30">
                  <span className="text-accent-gold text-xl font-bold">{metadata.price}</span>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="space-y-8">
                <div>
                  {metadata?.category && (
                    <span className="text-accent-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                      {metadata.category}
                    </span>
                  )}
                  <h2 className="text-4xl md:text-5xl font-serif leading-tight">{title}</h2>
                  
                  {metadata?.location && (
                    <div className="flex items-center gap-2 text-text-muted mt-4">
                      <MapPin size={16} className="text-accent-gold" />
                      <span className="text-sm">{metadata.location}</span>
                    </div>
                  )}
                </div>

                {metadata?.details && (
                  <div className="flex gap-8 py-6 border-y border-white/5">
                    <div className="flex items-center gap-3">
                      <BedDouble size={20} className="text-accent-gold/50" />
                      <span className="text-sm font-medium">{metadata.details.split('•')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Maximize size={20} className="text-accent-gold/50" />
                      <span className="text-sm font-medium">{metadata.details.split('•')[1]}</span>
                    </div>
                  </div>
                )}

                {metadata?.date && (
                  <div className="flex items-center gap-3 text-text-muted text-xs uppercase tracking-widest">
                    <Calendar size={14} />
                    <span>{metadata.date}</span>
                  </div>
                )}

                <div className="prose prose-invert max-w-none">
                  <div className="text-text-muted leading-relaxed space-y-4">
                    {content}
                  </div>
                </div>

                <div className="pt-8">
                  <button className="w-full bg-accent-gold text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all duration-500">
                    Inquire Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
