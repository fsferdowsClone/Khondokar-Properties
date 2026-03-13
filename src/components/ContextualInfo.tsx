import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoData {
  title: string;
  description: string;
  x: number;
  y: number;
}

export const ContextualInfo = () => {
  const [activeInfo, setActiveInfo] = useState<InfoData | null>(null);
  const { language } = useLanguage();

  const infoMap: Record<string, Record<string, { title: string; description: string }>> = {
    en: {
      hero: { title: "Luxury Living", description: "Our properties are designed for those who appreciate the finer things in life, combining modern architecture with timeless elegance." },
      properties: { title: "Curated Portfolio", description: "Every property in our collection undergoes a rigorous verification process to ensure it meets our high standards of quality and location." },
      video: { title: "Visual Tours", description: "Experience our properties from the comfort of your home with high-definition cinematic tours." },
      why: { title: "Our Commitment", description: "With over 15 years of experience, we provide transparent and professional real estate services in Dhaka's most prestigious areas." },
      testimonials: { title: "Client Trust", description: "We take pride in our long-term relationships with families and investors who trust us with their most significant assets." },
      blog: { title: "Market Intelligence", description: "Stay informed with our expert analysis of the Dhaka real estate market and lifestyle trends." },
      booking: { title: "Personalized Service", description: "Schedule a private consultation to discuss your specific requirements and investment goals." }
    },
    bn: {
      hero: { title: "বিলাসবহুল জীবন", description: "আমাদের প্রপার্টিগুলো তাদের জন্য ডিজাইন করা হয়েছে যারা জীবনের সূক্ষ্ম জিনিসগুলোর প্রশংসা করেন, আধুনিক স্থাপত্যের সাথে কালজয়ী আভিজাত্যের সমন্বয় ঘটান।" },
      properties: { title: "বাছাইকৃত পোর্টফোলিও", description: "আমাদের সংগ্রহের প্রতিটি প্রপার্টি একটি কঠোর যাচাইকরণ প্রক্রিয়ার মধ্য দিয়ে যায় যাতে এটি আমাদের গুণমান এবং অবস্থানের উচ্চ মান পূরণ করে।" },
      video: { title: "ভিজ্যুয়াল ট্যুর", description: "হাই-ডেফিনিশন সিনেমাটিক ট্যুরের মাধ্যমে আপনার ঘরে বসেই আমাদের প্রপার্টিগুলো অনুভব করুন।" },
      why: { title: "আমাদের প্রতিশ্রুতি", description: "১৫ বছরেরও বেশি অভিজ্ঞতার সাথে, আমরা ঢাকার সবচেয়ে মর্যাদাপূর্ণ এলাকায় স্বচ্ছ এবং পেশাদার রিয়েল এস্টেট পরিষেবা প্রদান করি।" },
      testimonials: { title: "ক্লায়েন্ট ট্রাস্ট", description: "আমরা পরিবার এবং বিনিয়োগকারীদের সাথে আমাদের দীর্ঘমেয়াদী সম্পর্কের জন্য গর্বিত যারা তাদের সবচেয়ে গুরুত্বপূর্ণ সম্পদের জন্য আমাদের বিশ্বাস করেন।" },
      blog: { title: "মার্কেট ইন্টেলিজেন্স", description: "ঢাকার রিয়েল এস্টেট বাজার এবং লাইফস্টাইল ট্রেন্ড সম্পর্কে আমাদের বিশেষজ্ঞ বিশ্লেষণের সাথে অবগত থাকুন।" },
      booking: { title: "ব্যক্তিগতকৃত পরিষেবা", description: "আপনার নির্দিষ্ট প্রয়োজনীয়তা এবং বিনিয়োগের লক্ষ্য নিয়ে আলোচনা করার জন্য একটি ব্যক্তিগত পরামর্শের সময় নির্ধারণ করুন।" }
    }
  };

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const infoKey = target.closest('[data-info]')?.getAttribute('data-info');

    if (infoKey && infoMap[language][infoKey]) {
      const { title, description } = infoMap[language][infoKey];
      setActiveInfo({
        title,
        description,
        x: e.clientX,
        y: e.clientY
      });
    } else if (!target.closest('.context-info-box')) {
      setActiveInfo(null);
    }
  }, [language]);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <AnimatePresence>
      {activeInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          style={{
            left: Math.min(activeInfo.x, window.innerWidth - 320),
            top: Math.min(activeInfo.y, window.innerHeight - 200),
          }}
          className="fixed z-[300] context-info-box w-72 glass p-6 rounded-xl shadow-2xl border-accent-gold/30"
        >
          <button
            onClick={() => setActiveInfo(null)}
            className="absolute top-3 right-3 text-text-muted hover:text-accent-gold transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-3 text-accent-gold">
            <Info size={18} />
            <h4 className="font-serif font-semibold text-lg">{activeInfo.title}</h4>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {activeInfo.description}
          </p>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
            <span className="text-[10px] uppercase tracking-widest text-accent-gold/50">Khondokar Insights</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
