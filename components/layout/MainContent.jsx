'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import FeaturedCard from '@/components/communities/FeaturedCard';
import PopularCard from '@/components/communities/PopularCard';
import SectionHeader from '@/components/communities/SectionHeader';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MainContent() {
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [featuredRes, popularRes] = await Promise.all([
          fetch('/api/communities/featured', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/communities/popular', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setFeaturedCommunities(featuredData.data || []);
        }

        if (popularRes.ok) {
          const popularData = await popularRes.json();
          setPopularCommunities(popularData.data || []);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setError('Failed to load communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto bg-[#470224] p-8">
      <SearchBar onSearch={(query) => console.log('Search:', query)} />

      <div className="mt-8 relative h-60 rounded-xl overflow-hidden">
        <Image
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a66a9b4f-95f9-4434-931d-cc001574e859"
          alt="Find your community on Daccord"
          fill
          unoptimized={true}
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center px-10">
          <h2 className="text-white text-4xl font-extrabold">
            Find your community on Daccord
          </h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-12">
        <SectionHeader
          title="Featured community"
          actionLabel="See all"
          onActionClick={() => {}}
        />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : featuredCommunities.length > 0 ? (
            featuredCommunities.slice(0, 2).map((community) => (
              <FeaturedCard key={community.id} community={community} />
            ))
          ) : (
            <div className="text-white/60">No featured communities</div>
          )}
        </div>
      </div>

      <div className="mt-14">
        <SectionHeader
          title="Popular Right Now"
          actionLabel="See all"
          onActionClick={() => {}}
        />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : popularCommunities.length > 0 ? (
            popularCommunities.slice(0, 8).map((community) => (
              <PopularCard key={community.id} community={community} />
            ))
          ) : (
            <div className="text-white/60">No popular communities</div>
          )}
        </div>
      </div>
    </main>
  );
}