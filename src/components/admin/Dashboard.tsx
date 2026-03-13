import React, { useState, useEffect } from 'react';
import { db } from '@/src/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { Building2, MessageSquare, BookOpen, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    posts: 0,
    testimonials: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const unsubProperties = onSnapshot(collection(db, 'properties'), snap => setStats(s => ({...s, properties: snap.size})));
    const unsubBookings = onSnapshot(collection(db, 'bookings'), snap => setStats(s => ({...s, bookings: snap.size})));
    const unsubPosts = onSnapshot(collection(db, 'blogPosts'), snap => setStats(s => ({...s, posts: snap.size})));
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), snap => setStats(s => ({...s, testimonials: snap.size})));

    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecent = onSnapshot(q, snap => {
      setRecentBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubProperties(); unsubBookings(); unsubPosts(); unsubTestimonials(); unsubRecent();
    };
  }, []);

  const cards = [
    { name: 'Total Properties', value: stats.properties, icon: Building2, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
    { name: 'New Inquiries', value: stats.bookings, icon: MessageSquare, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
    { name: 'Blog Posts', value: stats.posts, icon: BookOpen, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
    { name: 'Testimonials', value: stats.testimonials, icon: Users, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif">Welcome back, Admin</h1>
        <p className="text-text-muted">Here's what's happening with Khondokar Properties today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-surface border border-border p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-text-muted text-sm font-medium mb-1">{card.name}</p>
            <h3 className="text-3xl font-serif">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif">Recent Inquiries</h3>
            <Link to="/admin/bookings" className="text-accent-gold text-sm font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-6">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center font-serif text-accent-gold">
                    {booking.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-xs text-text-muted">{booking.location} • {booking.propertyType}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {booking.status}
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-text-muted text-center py-10">No recent inquiries.</p>}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          <h3 className="text-xl font-serif mb-8">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/admin/properties" className="block w-full text-center py-4 rounded-small bg-accent-gold text-background font-semibold hover:bg-white transition-all">
              Add New Property
            </Link>
            <Link to="/admin/blog" className="block w-full text-center py-4 rounded-small border border-border hover:bg-white/5 transition-all font-semibold">
              Write Blog Post
            </Link>
            <Link to="/admin/content" className="block w-full text-center py-4 rounded-small border border-border hover:bg-white/5 transition-all font-semibold">
              Edit Site Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
