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
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-large mb-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
           <button className="bg-white text-background w-12 h-12 rounded-full flex items-center justify-center self-end mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <ArrowUpRight size={20} />
           </button>
        </div>
        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-small">
          <span className="text-accent-gold font-semibold">{price}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-accent-gold text-xs font-semibold uppercase tracking-wider">
          <MapPin size={14} />
          {location}
        </div>
        <h3 className="text-2xl font-serif group-hover:text-accent-gold transition-colors">{name}</h3>
        <div className="flex items-center gap-6 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <BedDouble size={16} />
            <span>{details.split('•')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={16} />
            <span>{details.split('•')[1]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
