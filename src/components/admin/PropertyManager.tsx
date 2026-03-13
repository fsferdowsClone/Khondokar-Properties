import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  details: string;
  image: string;
  category: string;
  isFeatured: boolean;
}

export const PropertyManager = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    details: '',
    image: '',
    category: 'Luxury Apartments',
    isFeatured: false
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'properties'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'properties')
    );
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'properties', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'properties'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'properties');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'properties');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      price: '',
      details: '',
      image: '',
      category: 'Luxury Apartments',
      isFeatured: false
    });
    setEditingId(null);
  };

  const openEdit = (prop: Property) => {
    setFormData({
      name: prop.name,
      location: prop.location,
      price: prop.price,
      details: prop.details,
      image: prop.image,
      category: prop.category,
      isFeatured: prop.isFeatured
    });
    setEditingId(prop.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Properties</h1>
          <p className="text-text-muted">Manage your real estate listings</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-accent-gold text-background px-6 py-3 rounded-small font-semibold flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={20} /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
              {prop.isFeatured && (
                <div className="absolute top-4 right-4 bg-accent-gold text-background text-[10px] font-bold px-2 py-1 rounded uppercase">
                  Featured
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-serif mb-1">{prop.name}</h3>
              <p className="text-text-muted text-sm mb-4">{prop.location}</p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                <span className="text-accent-gold font-semibold">{prop.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(prop)} className="p-2 text-text-muted hover:text-accent-gold transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(prop.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
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
              className="relative w-full max-w-2xl bg-surface border border-border rounded-xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Property Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. Gulshan Luxury Residence"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Location</label>
                  <input
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. Gulshan, Dhaka"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Price</label>
                  <input
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. ৳2.5 Crore"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Details</label>
                  <input
                    required
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. 3 Bed • 2400 sqft"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                  >
                    <option>Luxury Apartments</option>
                    <option>Family Homes</option>
                    <option>Commercial Spaces</option>
                    <option>Investment Projects</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Image URL</label>
                  <div className="flex gap-4">
                    <input
                      required
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="flex-1 bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="w-12 h-12 bg-background border border-border rounded-small flex items-center justify-center overflow-hidden">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-text-muted" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.isFeatured ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}
                  >
                    {formData.isFeatured && <Check size={14} className="text-background" />}
                  </button>
                  <span className="text-sm font-medium">Feature on Homepage</span>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full bg-accent-gold text-background py-4 rounded-small font-semibold hover:bg-white transition-all">
                    {editingId ? 'Update Property' : 'Create Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
