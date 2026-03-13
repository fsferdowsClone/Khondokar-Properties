import { db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const seedDemoData = async () => {
  const propertiesSnap = await getDocs(collection(db, 'properties'));
  if (propertiesSnap.empty) {
    const demoProperties = [
      {
        name: 'Gulshan Luxury Residence',
        location: 'Gulshan, Dhaka',
        price: '৳2.5 Crore',
        details: '3 Bed • 2400 sqft',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        category: 'Luxury Apartments',
        isFeatured: true,
        createdAt: serverTimestamp()
      },
      {
        name: 'Banani Modern Apartment',
        location: 'Banani, Dhaka',
        price: '৳1.8 Crore',
        details: '3 Bed • 2100 sqft',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        category: 'Luxury Apartments',
        isFeatured: true,
        createdAt: serverTimestamp()
      },
      {
        name: 'Dhanmondi Lake View',
        location: 'Dhanmondi, Dhaka',
        price: '৳2.1 Crore',
        details: '3 Bed • 2300 sqft',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        category: 'Family Homes',
        isFeatured: true,
        createdAt: serverTimestamp()
      }
    ];
    for (const p of demoProperties) {
      await addDoc(collection(db, 'properties'), p);
    }
  }

  const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
  if (testimonialsSnap.empty) {
    const demoTestimonials = [
      {
        name: 'Ahmed Sharif',
        role: 'Home Owner',
        text: 'Khondokar Properties helped me find the perfect home for my family in Gulshan. Their service is truly premium.',
        rating: 5,
        createdAt: serverTimestamp()
      },
      {
        name: 'Sarah Rahman',
        role: 'Investor',
        text: 'I have invested in multiple projects through them. Highly professional and transparent transactions.',
        rating: 5,
        createdAt: serverTimestamp()
      },
      {
        name: 'Tanvir Hossain',
        role: 'Business Owner',
        text: 'Finding a commercial space in Banani was easy with their help. Highly recommended!',
        rating: 5,
        createdAt: serverTimestamp()
      }
    ];
    for (const t of demoTestimonials) {
      await addDoc(collection(db, 'testimonials'), t);
    }
  }

  const blogsSnap = await getDocs(collection(db, 'blogPosts'));
  if (blogsSnap.empty) {
    const demoBlogs = [
      {
        title: 'Real Estate Trends in Dhaka 2026',
        excerpt: 'Discover the emerging neighborhoods and investment hotspots in the capital.',
        category: 'Market Trends',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
        content: 'Full content here...',
        createdAt: serverTimestamp()
      },
      {
        title: 'Luxury Living: What to Look For',
        excerpt: 'A guide to choosing the best amenities for your high-end apartment.',
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        content: 'Full content here...',
        createdAt: serverTimestamp()
      },
      {
        title: 'Home Buying Guide for Families',
        excerpt: 'Everything you need to know before purchasing your first home in Dhaka.',
        category: 'Guides',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        content: 'Full content here...',
        createdAt: serverTimestamp()
      }
    ];
    for (const b of demoBlogs) {
      await addDoc(collection(db, 'blogPosts'), b);
    }
  }
};
