import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'testimonials'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials')
    );
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'testimonials');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'testimonials');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      text: '',
      rating: 5
    });
    setEditingId(null);
  };

  const openEdit = (t: Testimonial) => {
    setFormData({
      name: t.name,
      role: t.role,
      text: t.text,
      rating: t.rating
    });
    setEditingId(t.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Testimonials</h1>
          <p className="text-text-muted">Manage client reviews</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-accent-gold text-background px-6 py-3 rounded-small font-semibold flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-surface border border-border p-6 rounded-xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < t.rating ? "fill-accent-gold text-accent-gold" : "text-border"} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="p-2 text-text-muted hover:text-accent-gold transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-text-muted italic mb-6 leading-relaxed flex-1">"{t.text}"</p>
            <div>
              <h4 className="font-serif text-lg">{t.name}</h4>
              <p className="text-accent-gold text-xs uppercase tracking-widest font-semibold">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-border rounded-xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Client Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Role/Title</label>
                  <input
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. Home Owner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Review Text</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={e => setFormData({...formData, text: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-accent-gold text-background py-4 rounded-small font-semibold hover:bg-white transition-all">
                  {editingId ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
