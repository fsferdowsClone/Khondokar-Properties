import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PropertyCard } from './PropertyCard';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
          >
            Curated Selection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-tight"
          >
            Featured <span className="italic">Properties</span>
          </motion.h2>
        </div>
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="flex flex-wrap gap-4"
        >
          {['All', 'Luxury Apartments', 'Family Homes', 'Commercial Spaces', 'Investment Projects'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "text-accent-gold border-b border-accent-gold pb-1 text-sm font-medium" : "text-text-muted hover:text-text-primary transition-colors text-sm font-medium"}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading properties...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
