import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/src/firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Mail, Phone, MapPin, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  budget: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: any;
}

export const BookingManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(data);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'bookings')
    );
    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'bookings');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bookings');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif">Bookings & Inquiries</h1>
        <p className="text-text-muted">Manage property visit requests</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-surface border border-border rounded-xl p-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif">{booking.name}</h3>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                  booking.status === 'contacted' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {booking.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-text-muted">
                  <Mail size={16} className="text-accent-gold" />
                  {booking.email}
                </div>
                <div className="flex items-center gap-3 text-text-muted">
                  <Phone size={16} className="text-accent-gold" />
                  {booking.phone}
                </div>
                <div className="flex items-center gap-3 text-text-muted">
                  <MapPin size={16} className="text-accent-gold" />
                  {booking.location}
                </div>
                <div className="flex items-center gap-3 text-text-muted">
                  <Calendar size={16} className="text-accent-gold" />
                  {booking.createdAt?.toDate().toLocaleDateString()}
                </div>
              </div>

              {booking.message && (
                <div className="bg-background/50 p-4 rounded-small border border-border/50">
                  <p className="text-sm text-text-muted italic">"{booking.message}"</p>
                </div>
              )}
            </div>

            <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
              <button
                onClick={() => updateStatus(booking.id, 'contacted')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-small bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                <Clock size={14} /> Mark Contacted
              </button>
              <button
                onClick={() => updateStatus(booking.id, 'closed')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-small bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                <CheckCircle size={14} /> Mark Closed
              </button>
              <button
                onClick={() => deleteBooking(booking.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-small bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-20 bg-surface border border-border rounded-xl">
            <MessageSquare size={48} className="text-text-muted mx-auto mb-4 opacity-20" />
            <p className="text-text-muted">No inquiries found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { MessageSquare } from 'lucide-react';
