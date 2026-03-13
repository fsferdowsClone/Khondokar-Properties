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
import { ContextualInfo } from './components/ContextualInfo';
import { DetailModal } from './components/DetailModal';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [blogIndex, setBlogIndex] = useState(0);
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
      <ContextualInfo />
      
      <DetailModal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title || ''}
        image={selectedBlog?.image || ''}
        metadata={{
          category: selectedBlog?.category,
          date: selectedBlog?.createdAt?.toDate().toLocaleDateString()
        }}
        content={
          <>
            <p className="text-xl font-serif italic text-accent-gold mb-6">{selectedBlog?.excerpt}</p>
            <p>The real estate landscape in Dhaka is evolving rapidly, driven by infrastructure developments and a growing demand for luxury living spaces. In this article, we explore the key factors shaping the market and what investors should look for in the coming year.</p>
            <p>From the lush greenery of Gulshan to the modern skyline of Banani, each neighborhood offers unique opportunities. Our expert team has analyzed current trends to provide you with actionable insights for your next property investment.</p>
          </>
        }
      />
      
      <main>
        <div data-info="hero" className="relative group/info">
          <div className="absolute top-32 right-8 z-30 opacity-0 group-hover/info:opacity-100 transition-opacity duration-500 hidden lg:block">
            <div className="flex items-center gap-2 text-accent-gold/50 text-[10px] uppercase tracking-widest">
              <span>Click for Insight</span>
              <div className="w-4 h-[1px] bg-accent-gold/30" />
            </div>
          </div>
          <HeroSection />
        </div>
        
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

        <div data-info="properties">
          <PropertyGrid />
        </div>
        
        <div data-info="video">
          <VideoShowcase />
        </div>
        
        <div data-info="why">
          <WhyChooseUs />
        </div>

        {/* Testimonials Section */}
        <section data-info="testimonials" className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
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
        <section id="blog" data-info="blog" className="py-32 px-6 md:px-12 bg-background overflow-hidden">
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
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setBlogIndex(prev => Math.max(0, prev - 1))}
                  disabled={blogIndex === 0}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-gold hover:border-accent-gold transition-all disabled:opacity-20"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setBlogIndex(prev => Math.min(blogs.length - 1, prev + 1))}
                  disabled={blogIndex >= blogs.length - 1}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-gold hover:border-accent-gold transition-all disabled:opacity-20"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative">
              <motion.div 
                animate={{ x: `-${blogIndex * (100 / (window.innerWidth > 768 ? 3 : 1))}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex gap-8"
              >
                {blogs.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="min-w-full md:min-w-[calc(33.333%-21.333px)] group cursor-pointer"
                    onClick={() => setSelectedBlog(post)}
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6 luxury-shadow">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-accent-gold">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 bg-accent-gold/30 rounded-full" />
                        <span className="text-text-muted">{post.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                      </div>
                      <h3 className="text-2xl font-serif group-hover:text-accent-gold transition-colors duration-300 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-text-muted line-clamp-2 leading-relaxed text-sm">
                        {post.excerpt}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <div data-info="booking">
          <BookingForm />
        </div>
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
