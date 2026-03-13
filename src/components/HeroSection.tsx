import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const HeroSection = () => {
  const [content, setContent] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920",
      headline: "Find Your Perfect Property",
      subheading: "Discover premium apartments, homes, and investment properties with Khondokar Properties."
    },
    {
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920",
      headline: "Luxury Living Redefined",
      subheading: "Experience the pinnacle of architecture and comfort in the heart of Dhaka."
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920",
      headline: "Invest in Your Future",
      subheading: "High-yield commercial spaces and strategic investment projects for the visionary."
    }
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteContent', 'home'), 
      (snap) => {
        if (snap.exists()) setContent(snap.data());
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'siteContent/home')
    );

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center px-6">
      {/* Parallax Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <motion.div style={{ y: y1 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={slides[currentSlide].image}
              alt="Luxury Real Estate"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 max-w-4xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-accent-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
              Excellence in Every Square Foot
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif mb-8 leading-[1.1] text-balance">
              {currentSlide === 0 && content?.heroHeadline ? content.heroHeadline : slides[currentSlide].headline}
            </h1>
            <p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {currentSlide === 0 && content?.heroSubheading ? content.heroSubheading : slides[currentSlide].subheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="group relative bg-accent-gold text-background px-10 py-4 rounded-small font-semibold overflow-hidden transition-all duration-300 hover:bg-white">
                <span className="relative z-10 flex items-center gap-2">
                  Browse Properties <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-10 py-4 rounded-small font-semibold border border-accent-teal/40 hover:bg-accent-teal/10 transition-all duration-300">
                Book Consultation
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-accent-gold' : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll to explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent-teal to-transparent" />
      </motion.div>
    </section>
  );
};
