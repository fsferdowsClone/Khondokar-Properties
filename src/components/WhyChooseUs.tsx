import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const reasons = [
  "Verified property listings",
  "Expert real estate consultation",
  "Prime locations in Dhaka",
  "Transparent transactions",
  "Professional client support"
];

export const WhyChooseUs = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-square rounded-xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
              alt="Modern Architecture"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-10 -right-10 glass p-10 rounded-xl hidden md:block max-w-xs"
          >
            <span className="text-4xl font-serif text-accent-gold block mb-2">15+</span>
            <span className="text-sm text-text-muted uppercase tracking-widest font-semibold">Years of Excellence in Dhaka Real Estate</span>
          </motion.div>
        </div>

        <div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
          >
            The Khondokar Advantage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-tight mb-8"
          >
            Why <span className="italic">Khondokar</span> Properties?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-muted text-lg mb-12 leading-relaxed"
          >
            We don't just sell properties; we build legacies. Our commitment to transparency and excellence has made us a trusted name in Dhaka's premium real estate market.
          </motion.p>

          <div className="space-y-6">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal group-hover:bg-accent-teal group-hover:text-background transition-colors">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-lg font-medium">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
