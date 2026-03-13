import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAgNTBMNTAgMjAwSDkwVjQ1MEgyMTBWMzAwSDI5MFY0NTBIMzkwVjIwMEg0NTBMMjUwIDUwWiIgZmlsbD0iIzAwMkI0OSIvPgo8cGF0aCBkPSJNMjUwIDUwTDE1MCAxMjVMMjUwIDIwMEwzNTAgMTI1TDI1MCA1MFoiIGZpbGw9IiMyRDZBNzQiLz4KPHBhdGggZD0iTTI1MCAyMDBMMTUwIDI3NVY0NTBIMjUwVjIwMFoiIGZpbGw9IiNBNjhCNUIiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=" 
                alt="Khondokar Properties" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif text-xl tracking-tight font-semibold">
                Khondokar <span className="text-accent-gold">Properties</span>
              </span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Redefining luxury living in Dhaka with premium properties and unmatched service excellence.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-accent-gold hover:border-accent-gold transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-text-primary font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'Projects', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted hover:text-accent-gold transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-serif text-lg mb-6">Categories</h4>
            <ul className="space-y-4">
              {['Luxury Apartments', 'Family Homes', 'Commercial Spaces', 'Investment Projects'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted hover:text-accent-gold transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-serif text-lg mb-6">Newsletter</h4>
            <p className="text-text-muted mb-6">Subscribe to get the latest property updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-background border border-border rounded-small px-4 py-2 w-full outline-none focus:border-accent-gold" />
              <button className="bg-accent-gold text-background px-4 py-2 rounded-small font-semibold">Join</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© 2026 Khondokar Properties. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-accent-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent-gold transition-colors">Terms of Service</a>
            <Link 
              to="/admin" 
              className="px-4 py-2 border border-accent-gold/30 rounded-small text-accent-gold hover:bg-accent-gold hover:text-background transition-all duration-300 font-semibold"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
