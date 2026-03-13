import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.projects': 'Projects',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'hero.badge': 'Excellence in Every Square Foot',
    'hero.headline': 'Find Your Perfect Property',
    'hero.subheading': 'Discover premium apartments, homes, and investment properties with Khondokar Properties.',
    'hero.cta.browse': 'Browse Properties',
    'hero.cta.book': 'Book Consultation',
    'featured.title': 'Featured Properties',
    'featured.subtitle': 'Handpicked premium listings for you',
    'testimonials.title': 'Trusted by Families & Investors',
    'testimonials.badge': 'Client Stories',
    'blog.title': 'Latest from Our Blog',
    'blog.badge': 'Insights & News',
    'blog.cta': 'View All Posts',
    'booking.title': 'Book a Property Visit',
    'booking.subtitle': 'Schedule a private tour of your dream home today.',
    'footer.tagline': 'Redefining luxury living in Dhaka with premium properties and unmatched service excellence.',
    'footer.links': 'Quick Links',
    'footer.categories': 'Categories',
    'footer.newsletter': 'Newsletter'
  },
  bn: {
    'nav.home': 'হোম',
    'nav.properties': 'প্রপার্টিজ',
    'nav.projects': 'প্রজেক্টস',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.contact': 'যোগাযোগ',
    'hero.badge': 'প্রতিটি বর্গফুটে শ্রেষ্ঠত্ব',
    'hero.headline': 'আপনার নিখুঁত প্রপার্টি খুঁজুন',
    'hero.subheading': 'খন্দকার প্রপার্টিজের সাথে প্রিমিয়াম অ্যাপার্টমেন্ট, বাড়ি এবং বিনিয়োগের প্রপার্টি আবিষ্কার করুন।',
    'hero.cta.browse': 'প্রপার্টি দেখুন',
    'hero.cta.book': 'পরামর্শ বুক করুন',
    'featured.title': 'সেরা প্রপার্টিসমূহ',
    'featured.subtitle': 'আপনার জন্য বাছাই করা প্রিমিয়াম লিস্টিং',
    'testimonials.title': 'পরিবার এবং বিনিয়োগকারীদের দ্বারা বিশ্বস্ত',
    'testimonials.badge': 'ক্লায়েন্ট স্টোরিজ',
    'blog.title': 'আমাদের ব্লগ থেকে সর্বশেষ',
    'blog.badge': 'ইনসাইটস এবং নিউজ',
    'blog.cta': 'সব পোস্ট দেখুন',
    'booking.title': 'প্রপার্টি ভিজিট বুক করুন',
    'booking.subtitle': 'আজই আপনার স্বপ্নের বাড়ির একটি প্রাইভেট ট্যুর শিডিউল করুন।',
    'footer.tagline': 'প্রিমিয়াম প্রপার্টি এবং অতুলনীয় সেবার মাধ্যমে ঢাকায় বিলাসবহুল জীবনযাত্রাকে নতুনভাবে সংজ্ঞায়িত করা।',
    'footer.links': 'দ্রুত লিঙ্ক',
    'footer.categories': 'ক্যাটাগরি',
    'footer.newsletter': 'নিউজলেটার'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
