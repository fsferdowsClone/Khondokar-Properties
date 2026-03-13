import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyGrid } from './components/PropertyGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { VideoShowcase } from './components/VideoShowcase';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { PropertyManager } from './components/admin/PropertyManager';
import { BookingManager } from './components/admin/BookingManager';
import { BlogManager } from './components/admin/BlogManager';
import { TestimonialManager } from './components/admin/TestimonialManager';
import { ContentManager } from './components/admin/ContentManager';
import { VideoManager } from './components/admin/VideoManager';

import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, query, orderBy, limit, doc } from 'firebase/firestore';
import { useLanguage } from './contexts/LanguageContext';
import { seedDemoData } from './utils/seedData';

const PublicSite = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    seedDemoData();
    
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), 
      (snap) => {
        setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials')
    );

    const unsubBlogs = onSnapshot(query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(3)), 
      (snap) => {
        setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'blogPosts')
    );

    const unsubContent = onSnapshot(doc(db, 'siteContent', 'home'), 
      (snap) => {
        if (snap.exists()) setSiteContent(snap.data());
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'siteContent/home')
    );

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        
        <VideoShowcase />
        
        <WhyChooseUs />

        {/* Testimonials Section */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
          >
            {t('testimonials.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-tight mb-20"
          >
            {t('testimonials.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.length > 0 ? testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
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
            )) : (
              <p className="col-span-full text-text-muted">Loading testimonials...</p>
            )}
          </div>
        </section>
        
        {/* Blog Section */}
        <section id="blog" className="py-32 px-6 md:px-12 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-accent-gold uppercase tracking-widest text-xs font-semibold mb-4 block"
                >
                  {t('blog.badge')}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-serif leading-tight"
                >
                  {t('blog.title')}
                </motion.h2>
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-accent-gold font-semibold flex items-center gap-2 hover:gap-4 transition-all"
              >
                {t('blog.cta')} <ArrowRight size={20} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {blogs.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-semibold text-accent-gold">
                      <span>{post.category}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className="text-text-muted">{post.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                    </div>
                    <h3 className="text-2xl font-serif group-hover:text-accent-gold transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-text-muted line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
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
        <Route path="/admin/blog" element={<AdminLayout><BlogManager /></AdminLayout>} />
        <Route path="/admin/videos" element={<AdminLayout><VideoManager /></AdminLayout>} />
        <Route path="/admin/testimonials" element={<AdminLayout><TestimonialManager /></AdminLayout>} />
        <Route path="/admin/content" element={<AdminLayout><ContentManager /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><div className="text-center py-20 text-text-muted">Site Settings Coming Soon</div></AdminLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
