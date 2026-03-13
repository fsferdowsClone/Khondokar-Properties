import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Gulshan',
    propertyType: 'Luxury Apartment',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: 'Gulshan',
        propertyType: 'Luxury Apartment',
        budget: '',
        message: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
          >
            Get in Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-tight mb-8"
          >
            Book a <span className="italic">Property</span> Visit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-muted text-lg mb-12"
          >
            Ready to see your future home? Fill out the form and our expert consultants will get back to you within 24 hours.
          </motion.p>

          <div className="space-y-8">
             <div>
               <h4 className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-2">Office Address</h4>
               <p className="text-xl font-serif">Level 12, Crystal Palace, Gulshan 2, Dhaka</p>
             </div>
             <div>
               <h4 className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-2">Contact Info</h4>
               <p className="text-xl font-serif">+880 1711 000000</p>
               <p className="text-xl font-serif">info@khondokarproperties.com</p>
             </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface p-8 md:p-12 rounded-xl border border-border"
        >
          {isSuccess ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-accent-teal/10 text-accent-teal rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-serif">Request Received</h3>
              <p className="text-text-muted">Thank you for your interest. Our team will contact you shortly.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-accent-teal font-semibold hover:underline"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  type="text" 
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Phone</label>
                <input 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  type="tel" 
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors" 
                  placeholder="+880..." 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Email</label>
                <input 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  type="email" 
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors" 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Location</label>
                <select 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                >
                  <option>Gulshan</option>
                  <option>Banani</option>
                  <option>Dhanmondi</option>
                  <option>Uttara</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Budget</label>
                <input 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  type="text" 
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors" 
                  placeholder="e.g. 2 Crore" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  rows={4} 
                  className="w-full bg-background border border-border rounded-small px-4 py-3 focus:border-accent-gold outline-none transition-colors" 
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>
              <button 
                disabled={isSubmitting}
                className="md:col-span-2 bg-accent-gold text-background py-4 rounded-small font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'} <Send size={18} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
