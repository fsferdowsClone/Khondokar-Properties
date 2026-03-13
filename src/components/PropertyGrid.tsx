import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PropertyCard } from './PropertyCard';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { cn } from '@/src/lib/utils';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  details: string;
  image: string;
  category: string;
  isFeatured: boolean;
}

export const PropertyGrid = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'properties');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const filteredProperties = activeFilter === 'All' 
    ? properties 
    : properties.filter(p => p.category.includes(activeFilter));

  return (
    <section id="properties" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-6 block"
          >
            Curated Selection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif leading-[0.9] text-balance"
          >
            {t('featured.title')}
          </motion.h2>
        </div>
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="flex flex-wrap gap-x-8 gap-y-4"
        >
          {['All', 'Luxury Apartments', 'Family Homes', 'Commercial Spaces', 'Investment Projects'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 pb-2 border-b-2",
                activeFilter === filter ? "text-accent-gold border-accent-gold" : "text-text-muted border-transparent hover:text-text-primary"
              )}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>

      {loading ? (
        <div className="text-center py-32">
          <div className="inline-block w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-text-muted font-serif italic">Curating your collection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              name={prop.name}
              location={prop.location}
              price={prop.price}
              details={prop.details}
              image={prop.image}
            />
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center py-20 text-text-muted">No properties found in this category.</div>
          )}
        </div>
      )}
    </section>
  );
};
