import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, RefreshCw } from 'lucide-react';

export const ContentManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    heroHeadline: 'Find Your Perfect Property',
    heroSubheading: 'Discover premium apartments, homes, and investment properties with Khondokar Properties.',
    aboutHeadline: 'Why Khondokar Properties?',
    aboutText: "We don't just sell properties; we build legacies. Our commitment to transparency and excellence has made us a trusted name in Dhaka's premium real estate market.",
    contactEmail: 'info@khondokar.com',
    contactPhone: '+880 1234 567890',
    contactAddress: 'Gulshan 2, Dhaka, Bangladesh'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteContent', 'home'), 
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(prev => ({ ...prev, ...snapshot.data() }));
        }
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'siteContent/home')
    );
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteContent', 'home'), {
        ...content,
        updatedAt: serverTimestamp()
      });
      alert('Content updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'siteContent/home');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-text-muted">Loading site content...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Site Content</h1>
          <p className="text-text-muted">Edit main website text and information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-gold text-background px-6 py-3 rounded-small font-semibold flex items-center gap-2 hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
          <h3 className="text-xl font-serif border-b border-border pb-4">Hero Section</h3>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Headline</label>
            <input
              value={content.heroHeadline}
              onChange={e => setContent({...content, heroHeadline: e.target.value})}
              className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Subheading</label>
            <textarea
              rows={3}
              value={content.heroSubheading}
              onChange={e => setContent({...content, heroSubheading: e.target.value})}
              className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
          <h3 className="text-xl font-serif border-b border-border pb-4">About Section</h3>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Headline</label>
            <input
              value={content.aboutHeadline}
              onChange={e => setContent({...content, aboutHeadline: e.target.value})}
              className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Description</label>
            <textarea
              rows={3}
              value={content.aboutText}
              onChange={e => setContent({...content, aboutText: e.target.value})}
              className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-surface border border-border p-8 rounded-xl space-y-6 lg:col-span-2">
          <h3 className="text-xl font-serif border-b border-border pb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Email</label>
              <input
                value={content.contactEmail}
                onChange={e => setContent({...content, contactEmail: e.target.value})}
                className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Phone</label>
              <input
                value={content.contactPhone}
                onChange={e => setContent({...content, contactPhone: e.target.value})}
                className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Address</label>
              <input
                value={content.contactAddress}
                onChange={e => setContent({...content, contactAddress: e.target.value})}
                className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
