'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Inspector from '@/components/layout/Inspector';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/communities/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch community details');
        }

        const data = await response.json();
        setCommunity(data.data);
      } catch (error) {
        console.error('Error fetching community:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCommunity();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#470224]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Inspector />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#470224]">
        <Sidebar />
        <div className="flex-1 p-8">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Community not found'}</AlertDescription>
          </Alert>
        </div>
        <Inspector />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#470224]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {community.banner_url && (
            <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
              <Image
                src={community.banner_url}
                alt={community.name}
                fill
                unoptimized={true}
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-start gap-6 mb-8">
            {community.avatar_url && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/40">
                <Image
                  src={community.avatar_url}
                  alt={community.name}
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{community.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-white/40 rounded-full text-sm text-white">
                  {community.member_count?.toLocaleString()} Members
                </span>
                <span className="px-3 py-1 bg-white/40 rounded-full text-sm text-white">
                  {community.category}
                </span>
              </div>
              <p className="text-white/75 text-lg mb-6">{community.description}</p>
              <Button className="bg-white text-[#470224] hover:bg-white/90">
                Join Community
              </Button>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About this community</h2>
            <p className="text-white/75 leading-relaxed">
              {community.description}
            </p>
          </div>
        </div>
      </main>
      <Inspector />
    </div>
  );
}