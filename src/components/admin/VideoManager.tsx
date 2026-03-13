import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Youtube, ExternalLink, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VideoManager = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    thumbnail: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'videos'));
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await updateDoc(doc(db, 'videos', editingVideo.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'videos'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
    } catch (err) {
      handleFirestoreError(err, editingVideo ? OperationType.UPDATE : OperationType.CREATE, 'videos');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteDoc(doc(db, 'videos', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'videos');
      }
    }
  };

  const openModal = (video: any = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        youtubeUrl: video.youtubeUrl,
        description: video.description || '',
        thumbnail: video.thumbnail || ''
      });
    } else {
      setEditingVideo(null);
      setFormData({ title: '', youtubeUrl: '', description: '', thumbnail: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif">Video Showcase</h2>
          <p className="text-text-muted">Manage YouTube videos for the homepage gallery</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-accent-gold text-background px-6 py-3 rounded-small font-semibold flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={20} /> Add New Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-surface border border-border rounded-xl overflow-hidden group">
            <div className="relative aspect-video">
              <img 
                src={video.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/maxresdefault.jpg`} 
                alt={video.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={video.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-background p-3 rounded-full hover:scale-110 transition-transform"
                >
                  <Youtube size={24} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif mb-2 truncate">{video.title}</h3>
              <p className="text-text-muted text-sm line-clamp-2 mb-4">{video.description}</p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => openModal(video)}
                  className="p-2 text-text-muted hover:text-accent-gold transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(video.id)}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface border border-border w-full max-w-lg rounded-xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif">{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
                <button onClick={closeModal} className="text-text-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Video Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="e.g. Luxury Penthouse Tour"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">YouTube URL or ID</label>
                  <input 
                    required
                    value={formData.youtubeUrl}
                    onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Custom Thumbnail URL (Optional)</label>
                  <input 
                    value={formData.thumbnail}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold"
                    placeholder="Leave blank to use YouTube default"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-background border border-border rounded-small px-4 py-3 outline-none focus:border-accent-gold resize-none"
                    placeholder="Brief description of the video..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent-gold text-background py-4 rounded-small font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingVideo ? 'Update Video' : 'Save Video'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
