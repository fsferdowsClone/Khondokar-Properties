import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: any;
}

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Real Estate Tips',
    author: 'Admin'
  });

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setPosts(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'blogPosts')
    );
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'blogPosts', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'blogPosts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'blogPosts');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'Real Estate Tips',
      author: 'Admin'
    });
    setEditingId(null);
  };

  const openEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author
    });
    setEditingId(post.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Blog Posts</h1>
          <p className="text-text-muted">Manage your articles and news</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-accent-gold text-background px-6 py-3 rounded-small font-semibold flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={20} /> New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-accent-gold text-background text-[10px] font-bold px-2 py-1 rounded uppercase">
                {post.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-serif mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-text-muted text-sm mb-6 line-clamp-3">{post.excerpt}</p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Calendar size={14} />
                  {post.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(post)} className="p-2 text-text-muted hover:text-accent-gold transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
              className="relative w-full max-w-3xl bg-surface border border-border rounded-xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif">{editingId ? 'Edit Article' : 'New Article'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    >
                      <option>Real Estate Tips</option>
                      <option>Market Trends</option>
                      <option>Company News</option>
                      <option>Lifestyle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Author</label>
                    <input
                      required
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Image URL</label>
                  <div className="flex gap-4">
                    <input
                      required
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="flex-1 bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    />
                    <div className="w-12 h-12 bg-background border border-border rounded-small flex items-center justify-center overflow-hidden">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-text-muted" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Excerpt</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content (Markdown supported)</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-accent-gold text-background py-4 rounded-small font-semibold hover:bg-white transition-all">
                  {editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
