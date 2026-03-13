import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyGrid } from './components/PropertyGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { PropertyManager } from './components/admin/PropertyManager';
import { BookingManager } from './components/admin/BookingManager';

const PublicSite = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background selection:bg-accent-gold selection:text-background">
      <Navbar />
      
      <main>
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-20 px-6 md:px-12 border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {['Luxury Apartments', 'Family Homes', 'Commercial Spaces', 'Investment Projects'].map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="h-1 bg-border group-hover:bg-accent-gold transition-colors duration-500 mb-6" />
                  <h4 className="text-xl font-serif group-hover:text-accent-gold transition-colors">{cat}</h4>
                  <p className="text-text-muted text-sm mt-2">Explore premium listings</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <PropertyGrid />
        
        <WhyChooseUs />

        {/* Testimonials Section */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
          >
            Client Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-tight mb-20"
          >
            Trusted by <span className="italic">Families</span> & Investors
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Ahmed Rahman",
                role: "Property Investor",
                text: "The professionalism and transparency at Khondokar Properties are unmatched. They made my investment journey seamless."
              },
              {
                name: "Sarah Karim",
                role: "Home Owner",
                text: "Finding our dream home in Gulshan was so easy with their expert guidance. Highly recommended for premium service."
              },
              {
                name: "Zayed Hossain",
                role: "Business Owner",
                text: "Their commercial property portfolio is impressive. We found the perfect office space in Banani thanks to them."
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface p-10 rounded-xl border border-border text-left relative"
              >
                <div className="text-accent-gold text-4xl font-serif absolute top-6 right-8 opacity-20">"</div>
                <p className="text-text-muted italic mb-8 leading-relaxed">"{t.text}"</p>
                <div>
                  <h4 className="font-serif text-lg">{t.name}</h4>
                  <p className="text-accent-gold text-xs uppercase tracking-widest font-semibold">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <BookingForm />
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicSite />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/properties" element={<AdminLayout><PropertyManager /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><BookingManager /></AdminLayout>} />
        <Route path="/admin/blog" element={<AdminLayout><div className="text-center py-20 text-text-muted">Blog Management Coming Soon</div></AdminLayout>} />
        <Route path="/admin/testimonials" element={<AdminLayout><div className="text-center py-20 text-text-muted">Testimonial Management Coming Soon</div></AdminLayout>} />
        <Route path="/admin/content" element={<AdminLayout><div className="text-center py-20 text-text-muted">Site Content Editor Coming Soon</div></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><div className="text-center py-20 text-text-muted">Site Settings Coming Soon</div></AdminLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
