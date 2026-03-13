import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#' },
    { name: t('nav.properties'), href: '#properties' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-12',
        isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNTBMNTAgMjAwSDkwVjQ1MEgyMTBWMzAwSDI5MFY0NTBIMzkwVjIwMEg0NTBMMjUwIDUwWiIgZmlsbD0iIzAwMkI0OSIvPgo8cGF0aCBkPSJNMjUwIDUwTDE1MCAxMjVMMjUwIDIwMEwzNTAgMTI1TDI1MCA1MFoiIGZpbGw9IiMyRDZBNzQiLz4KPHBhdGggZD0iTTI1MCAyMDBMMTUwIDI3NVY0NTBIMjUwVjIwMFoiIGZpbGw9IiNBNjhCNUIiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=" 
            alt="Khondokar Properties" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif text-xl tracking-tight font-semibold hidden sm:block">
            Khondokar <span className="text-accent-gold">Properties</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-gold transition-colors"
          >
            <Globe size={16} />
            {language === 'en' ? 'Bangla' : 'English'}
          </button>

          <Link 
            to="/admin" 
            className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-gold transition-colors"
          >
            <Lock size={16} />
            Admin
          </Link>

          <button className="bg-accent-gold text-background px-6 py-2 rounded-small text-sm font-semibold hover:bg-white transition-all duration-300">
            Book Visit
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="text-text-muted hover:text-accent-gold"
          >
            <Globe size={20} />
          </button>
          <button
            className="text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-surface z-50 md:hidden flex flex-col p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-serif text-xl font-semibold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-muted">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-2xl font-serif text-text-primary hover:text-accent-gold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Link
                  to="/admin"
                  className="text-2xl font-serif text-text-primary hover:text-accent-gold transition-colors flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lock size={20} />
                  Admin Panel
                </Link>
              </div>
              <div className="mt-auto pt-8 border-t border-border">
                <button className="w-full bg-accent-gold text-background py-4 rounded-small font-semibold">
                  Book Visit
                </button>
                <div className="mt-8 flex flex-col gap-2 text-sm text-text-muted">
                  <p>Gulshan 2, Dhaka</p>
                  <p>+880 1711 000000</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
