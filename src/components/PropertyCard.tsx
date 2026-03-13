import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Maximize, BedDouble, ArrowUpRight } from 'lucide-react';

interface PropertyProps {
  name: string;
  location: string;
  price: string;
  details: string;
  image: string;
}

export const PropertyCard: React.FC<PropertyProps> = ({ name, location, price, details, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group cursor-pointer relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 luxury-shadow">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           <div className="flex justify-between items-end">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
               <button className="bg-accent-gold text-background px-4 py-2 rounded-small text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                 View Details
               </button>
             </div>
             <button className="bg-white/10 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:bg-accent-gold hover:border-accent-gold transition-all duration-300">
               <ArrowUpRight size={20} />
             </button>
           </div>
        </div>

        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-small border-accent-gold/20">
          <span className="text-accent-gold font-bold tracking-tight">{price}</span>
        </div>
      </div>
      
      <div className="space-y-3 px-2">
        <div className="flex items-center gap-2 text-accent-gold text-[10px] font-bold uppercase tracking-[0.2em]">
          <MapPin size={12} className="text-accent-gold/70" />
          {location}
        </div>
        <h3 className="text-2xl md:text-3xl font-serif group-hover:text-accent-gold transition-colors duration-300 leading-tight">{name}</h3>
        <div className="flex items-center gap-6 text-text-muted text-xs font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <BedDouble size={14} className="text-accent-gold/50" />
            <span>{details.split('•')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={14} className="text-accent-gold/50" />
            <span>{details.split('•')[1]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
