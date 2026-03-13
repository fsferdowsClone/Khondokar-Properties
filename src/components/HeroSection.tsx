import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center px-6">
      {/* Parallax Background */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Real Estate"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="relative z-20 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-accent-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            Excellence in Every Square Foot
          </span>
          <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] text-balance">
            Find Your <span className="italic">Perfect</span> Property
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover premium apartments, homes, and investment properties with Khondokar Properties.
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
