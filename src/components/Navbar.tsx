import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Properties', href: '#properties' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
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
          <button className="bg-accent-gold text-background px-6 py-2 rounded-small text-sm font-semibold hover:bg-white transition-all duration-300">
            Book Visit
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface border-b border-border p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-text-muted hover:text-accent-gold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-accent-gold text-background px-6 py-3 rounded-small text-center font-semibold">
              Book Visit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
